import { Router } from "express";
import { login, logout, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route("/login").post(login);
router.route("/logout").post(authenticateUser, logout);
router.route("/refresh-token").post(refreshAccessToken);



export default router

