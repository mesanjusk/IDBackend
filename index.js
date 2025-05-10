import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';
import listingRoutes from './routes/listing.js';

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
app.use(express.json({ limit: '20mb' })); // or higher if needed
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Set up static file serving
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Use the imageRoutes for your image upload logic
app.use('/api/images', imageRoutes);
app.use('/api/listings', listingRoutes);

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
