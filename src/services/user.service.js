import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

const createUser = async ({
  username,
  name,
  email,
  password,
  avatarLocalPath,
}) => {
  if ([username, name, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User with this username or email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(500, "Error uploading avatar");

  const user = await User.create({
    username: username.toLowerCase(),
    name,
    email,
    password: hashedPassword,
    avatar: avatar.url,
    avatarPublicId: avatar.public_id,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) throw new ApiError(500, "Error creating user");

  return createdUser;
};
const loginUser = async ({ username, email, password }) => {
  if (![username || email, password].every((field) => field?.trim())) {
    throw new ApiError(400, "Username/email and password are required");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "Invalid username/email or password");
  }
  const isPasswordCorrect = await user.isValidPassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(404, "Invalid password");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!loggedInUser) {
    throw new ApiError(500, "Error logging in user");
  }

  const options = {
    httpOnly: true,
    secure: false,
  };
  return { loggedInUser, accessToken, refreshToken, options };
};

const logoutUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: false,
  };
  return { user, options };
};

const incomingRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized: No refresh token provided");
  }
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Refresh token is not matched");
  }
  const options = {
    httpOnly: true,
    secure: false,
  };

  const { accessToken, newRefreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  return { accessToken, newRefreshToken, options };
};

const updatePassword = async (userId, currentPassword, newPassword) => {
  if (![currentPassword, newPassword].every((field) => field?.trim())) {
    throw new ApiError(400, "Current password and new password are required");
  }
  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from current password",
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isCurrentPasswordCorrect = await user.isValidPassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save({ validateBeforeSave: false });
  return true;
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateAccountDetails = 
  async (userId, { name, email, username }) => {
    if (!userId) {
      throw new ApiError(400, "User is not logged in");
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { name: name, email: email, username: username },
      },
      { new: true },
    ).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }
;

const updateUserAvatar = async (userId, avatarLocalPath) => {
  if (!userId) {
    throw new ApiError(400, "User is not logged in");
  }
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");
  await deleteFromCloudinary((await User.findById(userId)).avatarPublicId);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(500, "Error uploading avatar");
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { avatar: avatar.url, avatarPublicId: avatar.public_id },
    },
    { new: true },
  ).select("-password");
  return user;
};

const deleteUser = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "User is not logged in");
  }
  const user = await User.findByIdAndDelete(userId).select("-password");
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await deleteFromCloudinary(user.avatarPublicId);
  return user;
};



export {
  createUser,
  loginUser,
  logoutUser,
  incomingRefreshToken,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  deleteUser,
};
