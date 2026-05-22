import mongoose from "mongoose";
import Post from "./post.model.js";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, "Name is required" ],
        minlength: [ 3, "Name must be at least 3 characters long" ],
        maxlength: [ 50, "Name must be at most 50 characters long" ],
    },
    profilePicture: {
        type: String,
        required: [ true, "Profile picture is required" ],
        minlength: [ 3, "Profile picture must be at least 3 characters long" ],
        maxlength: [ 50, "Profile picture must be at most 50 characters long" ],
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
});

const User = mongoose.model("User", userSchema);

export default User;