import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    requirements: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true,
        trim: true
    },

    duration: {
        type: String,
        required: true,
        trim: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Program = mongoose.model("Program", programSchema);

export default Program;