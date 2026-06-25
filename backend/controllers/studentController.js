import StudentApplication from "../models/StudentApplication.js";
import Program from "../models/Program.js";

/*
=================================================
CREATE APPLICATION
=================================================
*/
export const createApplication = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Check if application already exists
        const existingApplication = await StudentApplication.findOne({ userId: studentId });

        if (existingApplication) {
            return res.status(400).json({
                message: "Application already exists"
            });
        }

        const application = await StudentApplication.create({
            userId: studentId,
            status: "Draft"
        });

        res.status(201).json({
            message: "Application created successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
GET MY APPLICATION
=================================================
*/
export const getMyApplication = async (req, res) => {
    try {
        const application = await StudentApplication.findOne({
            userId: req.user.id
        }).populate("programChoice.firstChoice programChoice.secondChoice programChoice.thirdChoice");

        if (!application) {
            return res.status(404).json({
                message: "No application found"
            });
        }

        res.json(application);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
UPDATE PERSONAL INFORMATION
=================================================
*/
export const updatePersonalInfo = async (req, res) => {
    try {
        const application = await StudentApplication.findOneAndUpdate(
            { userId: req.user.id },
            { personalInfo: req.body },
            { new: true }
        );

        res.json({
            message: "Personal information updated",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
UPDATE ACADEMIC INFORMATION
=================================================
*/
export const updateAcademicInfo = async (req, res) => {
    try {
        const application = await StudentApplication.findOneAndUpdate(
            { userId: req.user.id },
            { academicInfo: req.body },
            { new: true }
        );

        res.json({
            message: "Academic information updated",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
SELECT PROGRAMS
=================================================
*/
export const selectPrograms = async (req, res) => {
    try {
        const { firstChoice, secondChoice, thirdChoice } = req.body;

        // verify programs exist
        const programs = await Program.find({
            _id: { $in: [firstChoice, secondChoice, thirdChoice] }
        });

        if (programs.length === 0) {
            return res.status(404).json({
                message: "Programs not found"
            });
        }

        const application = await StudentApplication.findOneAndUpdate(
            { userId: req.user.id },
            {
                programChoice: {
                    firstChoice,
                    secondChoice,
                    thirdChoice
                }
            },
            { new: true }
        );

        res.json({
            message: "Programs selected successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
=================================================
SUBMIT APPLICATION
=================================================
*/
export const submitApplication = async (req, res) => {
    try {
        const application = await StudentApplication.findOne({
            userId: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        application.status = "Submitted";
        await application.save();

        res.json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};