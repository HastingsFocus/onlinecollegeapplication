import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import generateActivationToken from "../utils/generateActivationToken.js";

export const createLecturer = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const existingLecturer = await User.findOne({ email });

        if (existingLecturer) {
            return res.status(400).json({
                success: false,
                message: "Lecturer already exists"
            });
        }

        const activationToken = generateActivationToken();
        const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const lecturer = await User.create({
            firstName,
            lastName,
            email,
            role: "lecturer",
            isActivated: false,
            activationToken,
            activationTokenExpires
        });

        const activationLink = `${process.env.CLIENT_URL}/activate-account/${activationToken}`;

        await sendEmail(
            email,
            "Lecturer Account Activation",
            `
                <h2>Welcome ${firstName}</h2>
                <p>Your lecturer account has been created.</p>
                <p>Click the link below to activate your account:</p>
                <a href="${activationLink}">Activate Account</a>
                <p>This link expires in 24 hours.</p>
            `
        );

        res.status(201).json({
            success: true,
            message: "Lecturer created successfully. Activation email sent.",
            lecturer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getLecturers = async (req, res) => {
    try {
        const lecturers = await User.find({ role: "lecturer" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: lecturers.length,
            lecturers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getLecturerById = async (req, res) => {
    try {
        const lecturer = await User.findOne({
            _id: req.params.id,
            role: "lecturer"
        }).select("-password");

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        res.status(200).json({
            success: true,
            lecturer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const disableLecturer = async (req, res) => {
    try {
        const lecturer = await User.findOne({
            _id: req.params.id,
            role: "lecturer"
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        lecturer.isActive = false;
        await lecturer.save();

        res.status(200).json({
            success: true,
            message: "Lecturer disabled successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const enableLecturer = async (req, res) => {
    try {
        const lecturer = await User.findOne({
            _id: req.params.id,
            role: "lecturer"
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        lecturer.isActive = true;
        await lecturer.save();

        res.status(200).json({
            success: true,
            message: "Lecturer enabled successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const activateLecturerAccount = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        const lecturer = await User.findOne({ activationToken: token });

        if (!lecturer) {
            return res.status(400).json({
                success: false,
                message: "Invalid activation token"
            });
        }

        if (lecturer.activationTokenExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Activation link has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        lecturer.password = hashedPassword;
        lecturer.isActivated = true;
        lecturer.activationToken = undefined;
        lecturer.activationTokenExpires = undefined;
        await lecturer.save();

        res.status(200).json({
            success: true,
            message: "Account activated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};