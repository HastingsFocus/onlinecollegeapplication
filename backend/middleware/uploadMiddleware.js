import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {

        folder: "college-applications",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "pdf"
        ]

    }

});


const upload = multer({

    storage: storage

});


export default upload;