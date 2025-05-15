// routes/categoryRoutes.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Banner from '../models/Banner.js';

const router = express.Router();

// Cloudinary Storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'banners',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// POST /api/categories - Upload category with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: 'Name and image are required.' });
    }

    const imageUrl = file.path;

    const banner = new Banner({ name, imageUrl });
    await banner.save();

    res.status(201).json(banner);
  } catch (err) {
    console.error('Error uploading banner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    console.error('Error fetching banners:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/banners/:id - Delete a banner
router.delete('/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    console.error('Error deleting Banner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/banners/:id - Update Banner name
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(banner);
  } catch (err) {
    console.error('Error updating banner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
