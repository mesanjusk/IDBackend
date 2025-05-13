// routes/categoryRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Category from '../models/Category.js';

const router = express.Router();

// Create uploads/categories if not exists
const categoryDir = path.join(path.resolve(), 'uploads/categories');
if (!fs.existsSync(categoryDir)) {
  fs.mkdirSync(categoryDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, categoryDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
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

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/categories/${file.filename}`;

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
