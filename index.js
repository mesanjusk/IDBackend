import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Your provided MongoDB URI
const MONGO_URI = 'mongodb+srv://sanjuahuja:cY7NtMKm8M10MbUs@cluster0.wdfsd.mongodb.net/SkCards';

if (!MONGO_URI) {
  console.error("MONGO_URI environment variable not set.");
  process.exit(1);
}

// Set up CORS, JSON parsing
app.use(cors());
app.use(express.json());

// Set up static file serving
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // specify the folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // generate a unique filename
  }
});

const upload = multer({ storage: storage });

// Use the imageRoutes for your image upload logic
app.use('/api/images', imageRoutes);

// Example of a file upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  // File uploaded successfully, you can now handle the uploaded file
  res.status(200).send({ message: 'File uploaded successfully', file: req.file });
});

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
