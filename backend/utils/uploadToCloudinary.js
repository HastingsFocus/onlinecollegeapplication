import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const uploadSingle = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "college-applications",
        resource_type: "auto",
        timeout: 300000 // 5 minutes
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

const uploadToCloudinary = async (file, retries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `☁️ Upload attempt ${attempt}/${retries}: ${file.originalname}`
      );

      return await uploadSingle(file);
    } catch (error) {
      lastError = error;

      console.log(
        `❌ Attempt ${attempt} failed for ${file.originalname}`
      );

      if (attempt < retries) {
        console.log("🔄 Retrying...");
      }
    }
  }

  throw lastError;
};

export default uploadToCloudinary;