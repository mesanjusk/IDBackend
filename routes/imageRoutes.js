// server/routes/imageRoutes.js
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

// Upload image
// Upload multiple images
router.post('/', upload.array('images[]'), async (req, res) => {
  try {
    const { title } = req.body;
    const images = req.files.map(file => {
      const { path, url, filename, public_id } = file;
      return {
        title,
        url: url || path,
        public_id: public_id || filename,
      };
    });

    await Image.insertMany(images); // Save multiple images at once
    res.status(201).json(images);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

  await newImage.save();
  res.status(201).json(newImage);
});

// Get all images
router.get('/', async (req, res) => {
  const images = await Image.find().sort({ _id: -1 });
  res.json(images);
});

export default router;
