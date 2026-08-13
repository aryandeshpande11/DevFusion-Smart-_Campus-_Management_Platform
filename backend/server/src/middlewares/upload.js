// validates file type/size before it ever reaches cloudinary, keeps memory storage since files are small
const multer = require('multer');
const AppError = require('../utils/appError');

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/zip'];
const maxFileSizeBytes = 5 * 1024 * 1024; // 5mb

function fileFilter(req, file, cb) {
  if (!allowedFileTypes.includes(file.mimetype)) {
    return cb(new AppError('That file type is not allowed', 400));
  }
  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSizeBytes },
  fileFilter,
});

module.exports = upload;
