const cloudinary = require("cloudinary");

exports.configCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
};

exports.uploadToCloudinary = async (file) => {
  const fileBuffer = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  return await cloudinary.v2.uploader.upload(fileBuffer, {
    folder: "bunkbee",
  });
};

exports.deleteFromCloudinary = async (publicId) => {
  await cloudinary.v2.uploader.destroy(publicId);
};
