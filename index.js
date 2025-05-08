import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Image from '../models/Image.js';

const router = express.Router();

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern-images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage });

// Upload image to Cloudinary and save metadata to MongoDB
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, category, instaUrl } = req.body;
    const { path, url, filename, public_id } = req.file;

    const newImage = new Image({
      title,
      url: url || path,  // Cloudinary URL or local path
      public_id: public_id || filename,  // Cloudinary public_id or local filename
      category,
      instaUrl,
    });

    await newImage.save();

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error while uploading image', error: error.message });
  }
});

// Get all images from database
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error while fetching images', error: error.message });
  }
});

export default router;
