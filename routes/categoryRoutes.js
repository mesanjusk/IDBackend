// routes/categoryRoutes.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Category from '../models/Category.js';
import Listing from '../models/Listing.js';
import { v4 as uuid } from "uuid";

const router = express.Router();

// Cloudinary Storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'categories',
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

    const category = new Category({ name, imageUrl, category_uuid: uuid() });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error('Error uploading category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all categories with usage status
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    const listings = await Listing.find({}, 'category'); 

    const usedCategoryUuids = new Set(listings.map((l) => l.category));

    const filtered = categories.filter(cat =>
      usedCategoryUuids.has(cat.category_uuid)
    );

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// DELETE category only if not used
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const isUsed = await Listing.exists({ category: category.name });
    if (isUsed) {
      return res.status(400).json({ message: 'Category is in use and cannot be deleted.' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// PUT /api/categories/:id - Update category name and/or image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    const updateData = { name };

    if (file) {
      updateData.imageUrl = file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
