import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import uploadOnCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import fs from "fs";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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
  
    const user =  await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    const options = {
    httpOnly: true,
    secure: false,
  };
    return { user, options };
}

export default { createUser, loginUser, logoutUser };
