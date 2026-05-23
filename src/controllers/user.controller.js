import userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiResponse from "../utils/apiResponse.util.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password
    } = req.body;
    const avatarLocalPath = req.file?.avatar[0]?.path;
    const user = await userService.createUser({ username, name, email, password, avatarLocalPath });
    return res.status(201).json(new ApiResponse(201, "User registered successfully", user));
});

export default {
    registerUser,
};