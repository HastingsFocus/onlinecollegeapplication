import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = express.Router();


router.post(
    "/",
    (req, res, next) => {

        upload.single("file")(req, res, function(error) {

           

            next();

        });

    },
    uploadFile
);


export default router;