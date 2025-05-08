// server/routes/imageRoutes.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Image from '../models/Image.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(path.resolve(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);  
  }
});
const upload = multer({ storage: storage }); 


// Upload image
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }

    const imagePaths = req.files.map(file => file.filename);

    const newImage = new Image({
      title: req.body.title,
      category: req.body.category,
      subcategory: req.body.subcategory,
      price: req.body.price,
      instagramUrl: req.body.instagramUrl,
      size: req.body.size,
      religions: req.body.religions,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      seoKeywords: req.body.seoKeywords,
      images: imagePaths 
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all images
router.get('/', async (req, res) => {
  const images = await Image.find().sort({ _id: -1 });
  res.json(images);
});

export default router;
