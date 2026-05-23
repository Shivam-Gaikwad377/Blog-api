import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import uploadonCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import fs from "fs";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createUser = async ({ username, name, email, password, avatarLocalPath }) => {
    if ([username, name, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
        throw new ApiError(409, "User with this username or email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) throw new ApiError(500, "Error uploading avatar")

    const user = await User.create({
        username: username.toLowerCase(),
        name, email,
        password: hashedPassword,
        avatar: avatar.url,
    })

    const createdUser = await User.findById(user._id).select("-password")
    if (!createdUser) throw new ApiError(500, "Error creating user")

    return createdUser
}

export default { createUser };
