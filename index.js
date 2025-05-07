import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Your provided MongoDB URI
const MONGO_URI = 'mongodb+srv://sanjuahuja:cY7NtMKm8M10MbUs@cluster0.wdfsd.mongodb.net/SkCards';

if (!MONGO_URI) {
  console.error("MONGO_URI environment variable not set.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/api/images', imageRoutes);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
