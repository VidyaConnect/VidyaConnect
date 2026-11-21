import multer from 'multer';

// Memory storage: the file is parsed and thrown away, it never goes to S3.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2 MB
  fileFilter: (req, file, cb) => {
    // Check the extension: browsers/Windows report CSV with many different MIME types.
    if (/\.(csv|xlsx)$/i.test(file.originalname)) return cb(null, true);
    const err = new Error('Only .csv or .xlsx files are allowed');
    err.status = 400;
    err.statusCode = 400;
    cb(err);
  },
});

export const bulkUpload = upload.single('file'); // form field name: "file"