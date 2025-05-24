import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import Listing from '../models/Listing.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v4 as uuid } from "uuid";
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern-images', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
  },
});

const upload = multer({ storage });

router.post('/', upload.array('images', 10), async (req, res) => {

  try {
    
    const { title, category, subcategory, price, instagramUrl, size, religions, 
      seoTitle, seoDescription, seoKeywords, discount, MOQ, Description,
  favorite } = req.body;

    const imageUrls = req.files.map(file => file.path); 

    const categoryDoc = await Category.findOne({
      $or: [{ name: category }, { category_uuid: category }]
    });

    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid category' });
    }

     const subcategoryDoc = await Subcategory.findOne({
      $or: [{ name: subcategory }, { subcategory_uuid: subcategory }]
    });

    if (!subcategoryDoc) {
      return res.status(400).json({ message: 'Invalid subcategory' });
    }

    const newListing = new Listing({
      listing_uuid: uuid(),
      title,
      category: categoryDoc.category_uuid,
      subcategory: subcategoryDoc.subcategory_uuid,
      price,
      instagramUrl,
      size,
      religions,
      seoTitle,
      seoDescription,
      seoKeywords,
      discount, 
      MOQ, 
      Description,
      favorite,
      images: imageUrls,
    });

    await newListing.save();

    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
     const listing = await Listing.findOne({ listing_uuid: req.params.id });
     if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/favorite', async (req, res) => {
  try {
    const query = {};

    if (req.query.favorite === '1') {
      query.favorite = '1';
    }

    const listings = await Listing.find(query);
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/sub', async (req, res) => {
  try {
    const { subcategory } = req.query;

    if (!subcategory) {
      return res.status(400).json({ error: "Missing subcategory" });
    }

    const listings = await Listing.find({ subcategory });

    res.json(listings);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Get a single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/listings/:id - Delete a listing
router.delete('/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'List deleted' });
  } catch (err) {
    console.error('Error deleting list:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/listings/:id - Update listing name
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    res.json(listing);
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;
