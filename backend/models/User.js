import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            default: null
        },

        resetPasswordToken: {
            type: String
        },

        resetPasswordExpires: {
            type: Date
        },

        activationToken: {
            type: String
        },

        activationTokenExpires: {
            type: Date
        },

        isActivated: {
            type: Boolean,
            default: false
        },

        role: {
            type: String,
            enum: ["admin", "lecturer", "student"],
            default: "student"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;