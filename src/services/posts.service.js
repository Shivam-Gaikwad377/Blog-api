
import ApiError from "../utils/ApiError.js";
import Post from "../models/post.model.js";

const createPost = async (userID, {title, content}) => {
    if(!userID) {
        throw new ApiError(401, "Unauthorized");
    }
    const post = await Post.create({
        title,
        content,
        author: userID,
    });
    const populatedPost = await post.populate("author", "name username avatar")
    return populatedPost;
};

const updatePost = async (postID, userID, {title, content}) => {
    const post = await Post.findById(postID).populate("author", "name username avatar");
    if(!post) {
        throw new ApiError(404, "Post not found");
    }
    if(post.author.toString() !== userID) {
        throw new ApiError(403, "Forbidden: You can only update your own posts");
    }
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    return post;
}

const deletePost = async (postID, userID) => {
    const post = await Post.findByIdAndDelete(postID);
    if(!post) {
        throw new ApiError(404, "Post not found");
    }
    if(post.author.toString() !== userID) {
        throw new ApiError(403, "Forbidden: You can only delete your own posts");
    }
    
    return post;
}

const getPostById = async (postID) => {
    const post = await Post.findById(postID).populate("author", "name username avatar");
    if(!post) {
        throw new ApiError(404, "Post not found");
    }
    return post;
}

const getUserPosts = async (userId, { page, postsPerPage } = {}) => {
    const query = Post.find({ author: userId })
        .populate("author", "name username avatar")
        .sort({ createdAt: -1 });

    if (page && postsPerPage) {
        query.limit(postsPerPage).skip((page - 1) * postsPerPage);
    }

    const [posts, total] = await Promise.all([
        query,
        Post.countDocuments({ author: userId })
    ]);

    return { posts, total };
};

const getAllPosts = async (postPerPage, page) => {
    const [posts, totalPosts] = await Promise.all([
        Post.find().populate("author", "name username avatar").sort({ createdAt: -1 }).skip((page - 1) * postPerPage).limit(postPerPage),
        Post.countDocuments(),
    ]);
    return {
        posts,
        totalPosts,
        totalPages: Math.ceil(totalPosts / postPerPage),
        currentPage: page,
    };
}

export { createPost, updatePost, deletePost, getPostById, getUserPosts, getUserPostsCount, getAllPosts };