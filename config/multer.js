const multer = require("multer");

const storage = multer.memoryStorage();

exports.upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
