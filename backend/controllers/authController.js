import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

/*
=================================================
STUDENT REGISTRATION
=================================================
*/
export const registerStudent = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "student",
            isActivated: true
        });

        res.status(201).json({
            message: "Student registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
LOGIN
=================================================
*/
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Account disabled"
            });
        }

        if(
    user.role === "lecturer" &&
    !user.isActivated
){

    return res.status(403).json({

        message:
        "Please activate your account first"

    });

}
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
ACTIVATE LECTURER ACCOUNT
=================================================
*/
export const activateLecturerAccount = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password required"
            });
        }

        const lecturer = await User.findOne({ activationToken: token });

        if (!lecturer) {
            return res.status(400).json({
                message: "Invalid activation token"
            });
        }

        if (lecturer.activationTokenExpires < new Date()) {
            return res.status(400).json({
                message: "Activation link expired"
            });
        }

        lecturer.password = await bcrypt.hash(password, 10);
        lecturer.isActivated = true;
        lecturer.activationToken = undefined;
        lecturer.activationTokenExpires = undefined;
        await lecturer.save();

        res.json({
            message: "Account activated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
CURRENT USER
=================================================
*/
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ user });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
FORGOT PASSWORD
=================================================
*/
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendEmail(
            email,
            "Online College Application System - Password Reset Request",
            `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #222;">Password Reset Request</h2>
                    <p>Hello ${user.firstName},</p>
                    <p>We received a request to reset the password for your account on the Online College Application System.</p>
                    <p>If you made this request, please click the button below to create a new password:</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetLink}" style="background: #222; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>This password reset link will expire after 15 minutes for security reasons.</p>
                    <p>If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
                    <br>
                    <p>
                        Regards,<br>
                        <strong>Online College Application System Team</strong>
                    </p>
                </div>
            `
        );

        res.json({
            message: "Password reset email sent"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
RESET PASSWORD
=================================================
*/
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            message: "Password reset successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};