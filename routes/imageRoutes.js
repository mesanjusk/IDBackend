import express from 'express';
import multer from 'multer';
import path from 'path';
import { saveImageMetadata } from '../controllers/imageController.js';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), saveImageMetadata);

export default router;
