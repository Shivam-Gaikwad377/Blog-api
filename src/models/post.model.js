import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [ true, "Title is required" ],
        minlength: [ 3, "Title must be at least 3 characters long" ],
        maxlength: [ 50, "Title must be at most 50 characters long" ],
    },
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
});

const Post = mongoose.model("Post", postSchema);    

export default Post;