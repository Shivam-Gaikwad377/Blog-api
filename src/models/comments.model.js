import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [ true, "Content is required" ],
        minlength: [ 3, "Content must be at least 3 characters long" ],
        maxlength: [ 1000, "Content must be at most 1000 characters long" ],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [ true, "Post is required" ],
    },
});

const Comment = mongoose.model("Comment", commentSchema);   

export default Comment;