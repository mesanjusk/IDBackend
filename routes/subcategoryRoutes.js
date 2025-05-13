// routes/categoryRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Subcategory from '../models/Subcategory.js';

const router = express.Router();

// Create uploads/subcategories if not exists
const subcategoryDir = path.join(path.resolve(), 'uploads/subcategories');
if (!fs.existsSync(subcategoryDir)) {
  fs.mkdirSync(subcategoryDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, subcategoryDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST /api/subcategories
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: 'Name and image are required.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/subcategories/${file.filename}`;

    const subcategory = new Subcategory({ name, imageUrl });
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
    const subcategories = await Subcategory.find();
    res.json(subcategories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
