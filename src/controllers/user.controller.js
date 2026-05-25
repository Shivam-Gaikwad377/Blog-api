import { createUser, logoutUser, loginUser, incomingRefreshToken } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiResponse from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password
    } = req.body;
    const avatarLocalPath = req.files?.avatar[0].path;
    const user = await createUser({ username, name, email, password, avatarLocalPath });
    return res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const { loggedInUser, accessToken, refreshToken, options } = await loginUser({ username, email, password });
    return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(new ApiResponse(200, { accessToken }, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
    const { user, options } = await logoutUser(req.user._id);
    return res.status(200).clearCookie("refreshToken", options).clearCookie("accessToken", options).json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const { accessToken, newRefreshToken, options } = await incomingRefreshToken(refreshToken);
    return res.status(200).cookie("refreshToken", newRefreshToken, options).cookie("accessToken", accessToken, options).json(new ApiResponse(200, { accessToken }, "Access token refreshed successfully"));
});

export {
    registerUser,
    login,
    logout,
    refreshAccessToken
};