import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Image from '../models/Image.js';

const router = express.Router();

// Create uploads directory if not exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Serve uploaded images
router.use('/uploads', express.static('uploads'));

// POST: Upload Image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, category, instaUrl } = req.body;
    const url = `${req.protocol}://${req.get('host')}/api/images/uploads/${req.file.filename}`;

    const newImage = new Image({ title, category, instaUrl, url });
    await newImage.save();

    res.status(201).json(newImage);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET: Fetch with category filter & sort
router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query;
    const filter = category ? { category } : {};
    const sortOption = sort === 'asc' ? 1 : -1;

    const images = await Image.find(filter).sort({ createdAt: sortOption });
    res.json(images);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router;
