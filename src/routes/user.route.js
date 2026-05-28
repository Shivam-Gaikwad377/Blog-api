import { Router } from "express";
import { login, logout, registerUser, refreshAccessToken, changePassword, updateUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route("/login").post(login);
router.route("/logout").post(authenticateUser, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(authenticateUser, changePassword);
router.route("/update-user").put(authenticateUser, updateUser);
export default router

