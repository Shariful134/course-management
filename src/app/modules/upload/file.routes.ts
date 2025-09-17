import express from 'express';
import { deleteFile, uploadFile } from './file.controllers';
import { upload } from '../../../utils/upload';
// import { uploadFile, deleteFile } from '../controllers/fileController';

const router = express.Router();

// Multer setup (temporary local storage)
// const upload = multer({ dest: 'uploads/' });

// Upload route
router.post('/upload', upload.single('file'), uploadFile);

// Delete route
router.delete('/delete', deleteFile);

export const fileRoutes = router;
