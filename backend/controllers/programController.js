
import Program from "../models/Program.js";

// CREATE PROGRAM
export const createProgram = async (req, res) => {
    try {
        const {
            name,
            code,
            description,
            requirements,
            department,
            duration
        } = req.body;

        const program = await Program.create({
            name,
            code,
            description,
            requirements,
            department,
            duration,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Program created successfully",
            program
        });

    } catch (error) {
        // Duplicate programme code
        if (error.code === 11000 && error.keyPattern?.code) {
            return res.status(400).json({
                message: "A programme with this code already exists."
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL PROGRAMS
export const getPrograms = async (req, res) => {
    try {
        const programs = await Program.find()
            .populate("createdBy", "firstName lastName email");

        res.json(programs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET SINGLE PROGRAM
export const getProgramById = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }

        res.json(program);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE PROGRAM
export const updateProgram = async (req, res) => {
    try {
        const program = await Program.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }

        res.json({
            message: "Program updated",
            program
        });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.code) {
            return res.status(400).json({
                message: "A programme with this code already exists."
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// DELETE PROGRAM
export const deleteProgram = async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);

        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }

        res.json({
            message: "Program deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

