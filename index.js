import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import imageRoutes from './routes/imageRoutes.js';
import listingRoutes from './routes/listing.js';
import categoryRoutes from './routes/categoryRoutes.js'; // ✅ New import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in environment.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ✅ Static file serving for images
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// ✅ API Routes
app.use('/api/images', imageRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/categories', categoryRoutes); // ✅ Added category routes

// ✅ Health check
app.get('/api/ping', (req, res) => {
  res.status(200).send('✅ Backend is alive!');
});

// ✅ Connect to MongoDB and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
