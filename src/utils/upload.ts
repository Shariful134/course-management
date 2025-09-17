
import multer from 'multer';
 
// Memory storage - no files saved to disk
const memoryStorage = multer.memoryStorage();
 
const fileFilter = (req: any, file: any, cb: any) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
 
export const upload = multer({
  storage: memoryStorage, // ← NO DISK SAVING
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10, // Max 10 files
  },
  fileFilter: fileFilter,
});
 
// Upload configurations
const uploadSingle = upload.single('image');
const uploadMultiple = upload.fields([
  { name: 'files', maxCount: 10 },
]);
 
export const fileUploader = {
  upload,
  uploadSingle,
  uploadMultiple,
};
 
// Error handling middleware
export const handleMulterErrors = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files (max 10)' });
    }
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
// import multer from "multer";

// // Use memory storage instead of disk storage
// export const upload = multer({
//   storage: multer.memoryStorage(), // ← FILES STAY IN MEMORY
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//   },
//   fileFilter: (req: any, file: any, cb: any) => {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//       return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
//   },
// });