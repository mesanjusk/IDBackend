import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Subcategory from '../models/Subcategory.js';

const router = express.Router();

// Cloudinary Storage for multer (subcategory folder)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'subcategories',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// POST /api/subcategories
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const file = req.file;

    if (!name || !categoryId || !file) {
      return res.status(400).json({ message: 'Name, categoryId, and image are required.' });
    }

    const imageUrl = file.path;

    const subcategory = new Subcategory({ name, imageUrl, categoryId });
    await subcategory.save();

    res.status(201).json(subcategory);
  } catch (err) {
    console.error("Error uploading subcategory:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('categoryId', 'name'); // optional: populate category name
    res.json(subcategories);
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
