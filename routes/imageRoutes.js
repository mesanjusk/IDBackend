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

// Upload image route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    const { url, public_id } = req.file;

    if (!url || !public_id) {
      return res.status(400).json({ message: 'Cloudinary upload failed.' });
    }

    const newImage = new Image({
      title,
      url,
      public_id,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error while uploading', error });
  }
});

// Get all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Failed to fetch images', error });
  }
});

export default router;
