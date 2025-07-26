import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as buffers
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

export default upload;
