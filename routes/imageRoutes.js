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
allowed\_formats: \['jpg', 'jpeg', 'png'],
},
});
const upload = multer({ storage });

// Upload image
router.post('/', upload.single('image'), async (req, res) => {
const { title } = req.body;
const { path, url, filename, public\_id } = req.file;

const newImage = new Image({
title,
url: url || path,
public\_id: public\_id || filename,
});

await newImage.save();
res.status(201).json(newImage);
});

// Get all images
router.get('/', async (req, res) => {
const images = await Image.find().sort({ \_id: -1 });
res.json(images);
});

export default router;
