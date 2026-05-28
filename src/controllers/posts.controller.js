import asyncHandler from "../utils/asyncHandler.util.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createPost,
  updatePost,
  getAllPosts,
  deletePost,
  getPostById,
  getUserPosts,
} from "../services/posts.service.js";

const createNewPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await createPost(req.user._id, { title, content });
  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const updateExistingPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const post = await updatePost(postId, req.user._id, { title, content });
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

const getAllPostsController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const postPerPage = parseInt(req.query.postPerPage) || 10;
  const posts = await getAllPosts(postPerPage, page);
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getPostByIdController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await getPostById(postId);
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

const getUserPostsController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page);
  const postsPerPage = parseInt(req.query.postsPerPage);
  const posts = await getUserPosts(userId, { page, postsPerPage });
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "User posts fetched successfully"));
});

const deletePostController = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await deletePost(postId, req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post deleted successfully"));
});

export {
  createNewPost,
  updateExistingPost,
  getAllPostsController,
  getPostByIdController,
  getUserPostsController,
  deletePostController,
};
