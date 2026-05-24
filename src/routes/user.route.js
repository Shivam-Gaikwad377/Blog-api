import { Router } from "express";
import userController from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 }]), userController.registerUser);
router.route("/login").post(userController.loginUser);

//secured routes
router.route("/logout").post(authenticateUser, userController.logoutUser);



export default router

