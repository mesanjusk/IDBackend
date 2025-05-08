import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Your provided MongoDB URI
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI environment variable not set.");
  process.exit(1);
}

// Set up CORS, JSON parsing
app.use(cors());
app.use(express.json());

// Set up static file serving
const uploadsDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);  // Create the uploads directory if it doesn't exist
}
app.use('/uploads', express.static(uploadsDir));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // specify the folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // generate a unique filename
  }
});

const upload = multer({ storage: storage });

// Use the imageRoutes for your image upload logic
app.use('/api/images', imageRoutes);

// Example of a file upload route (single or multiple files based on the use case)
app.post('/upload', upload.array('images[]'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: 'No files uploaded' });
  }

  // Files uploaded successfully, handle the uploaded files here
  const uploadedFiles = req.files.map(file => file.filename);  // Store filenames if needed

  res.status(200).send({
    message: 'Files uploaded successfully',
    files: uploadedFiles,
  });
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
