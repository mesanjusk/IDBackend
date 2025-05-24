// routes/subcategoryRoutes.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Subcategory from '../models/Subcategory.js';
import Listing from '../models/Listing.js';

const router = express.Router();

// Cloudinary Storage for multer (subcategory folder)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'subcategories',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// POST /api/subcategories - Upload subcategory with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const file = req.file;

    if (!name || !categoryId || !file) {
      return res
        .status(400)
        .json({ message: 'Name, categoryId, and image are required.' });
    }

    const imageUrl = file.path;

    const subcategory = new Subcategory({ name, imageUrl, categoryId });
    await subcategory.save();

    res.status(201).json(subcategory);
  } catch (err) {
    console.error('Error uploading subcategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/subcategories - List all subcategories with category name
router.get('/', async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('categoryId', 'name');
    const listings = await Listing.find({}, 'subcategory');
     const usedSubcategoryNames = new Set(listings.map((l) => l.subcategory));

    const subcategoriesWithUsage = subcategories.map((cat) => ({
      ...cat._doc,
      isUsed: usedSubcategoryNames.has(cat.name),
    }));
    res.json(subcategoriesWithUsage);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/subcategories/:id - Delete subcategory
router.delete('/:id', async (req, res) => {
  try {
   const subcategory = await Subcategory.findById(req.params.id);
       if (!subcategory) {
         return res.status(404).json({ message: 'Subcategory not found' });
       }
   
       const isUsed = await Listing.exists({ subcategory: subcategory.name });
       if (isUsed) {
         return res.status(400).json({ message: 'Subcategory is in use and cannot be deleted.' });
       }
   
       await Subcategory.findByIdAndDelete(req.params.id);
       res.json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    console.error('Error deleting subcategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/subcategories/:id - Update subcategory name or categoryId
router.put('/:id', async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (categoryId) updatedData.categoryId = categoryId;

    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate('categoryId', 'name');

    res.json(subcategory);
  } catch (err) {
    console.error('Error updating subcategory:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
