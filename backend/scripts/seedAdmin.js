import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();
        const existingAdmin = await User.findOne({
            email: "admin@college.com"
        });
        if (existingAdmin) {
            console.log("Admin account already exists.");
            process.exit(0);
        }
        const hashedPassword = await bcrypt.hash("Admin@123", 10);
        const admin = await User.create({
            firstName: "System",
            lastName: "Administrator",
            email: "admin@college.com",
            password: hashedPassword,
            role: "admin",
            isActive: true
        });
        console.log("Admin account created successfully.");
        console.log(`Admin ID: ${admin._id}`);
        console.log(`Email: ${admin.email}`);
        console.log("Password: Admin@123");
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:");
        console.error(error.message);
        process.exit(1);
    }
};
seedAdmin();