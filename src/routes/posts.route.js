import { Router } from "express";
import { createNewPost, updateExistingPost, deletePostController, getAllPostsController, getPostByIdController, getUserPostsController } from "../controllers/posts.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload-post").post(authenticateUser, createNewPost);
router.route("/update-post/:postId").put(authenticateUser, updateExistingPost);
router.route("/delete-post/:postId").delete(authenticateUser, deletePostController);
router.route("/all-posts").get(getAllPostsController);
router.route("/post/:postId").get(getPostByIdController);
router.route("/user-posts/:userId").get(getUserPostsController);

export default router;