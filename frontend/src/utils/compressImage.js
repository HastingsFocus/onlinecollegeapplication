import imageCompression from "browser-image-compression";

const compressImage = async (file) => {
  // Don't compress PDFs
  if (file.type === "application/pdf") {
    return file;
  }

  // Don't compress non-images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8
  };

  try {
    console.log(
      `📷 Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`
    );

    const compressedFile = await imageCompression(file, options);

    console.log(
      `✅ Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    );

    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);

    // Upload original if compression fails
    return file;
  }
};

export default compressImage;