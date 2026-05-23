import mongoose from "mongoose";
import Post from "./post.model.js";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, "Name is required" ],
        minlength: [ 3, "Name must be at least 3 characters long" ],
        maxlength: [ 50, "Name must be at most 50 characters long" ],
    },
    username: {
        type: String,
        required: [ true, "Username is required" ],
        unique: true,
    },
    avatar: {
        type: String,
        required: [ true, "Avatar is required" ],
    },
    email: {
        type: String,
        required: [ true, "Email is required" ],
        unique: true,
    },
    password: {
        type: String,
        required: [ true, "Password is required" ],
        minlength: [ 6, "Password must be at least 6 characters long" ],
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;