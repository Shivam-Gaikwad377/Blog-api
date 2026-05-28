import mongoose from "mongoose";
import Post from "./post.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

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
    avatarPublicId: {
        type: String,
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
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken =  async function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    )
}
userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    )
}

const User = mongoose.model("User", userSchema);


export default User;