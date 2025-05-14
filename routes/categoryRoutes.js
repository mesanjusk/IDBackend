// routes/categoryRoutes.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Category from '../models/Category.js';

const router = express.Router();

// Cloudinary Storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'categories',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// POST /api/categories
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: 'Name and image are required.' });
    }

    const imageUrl = file.path; // Cloudinary returns `path` as secure_url

    const category = new Category({ name, imageUrl });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error("Error uploading category:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
