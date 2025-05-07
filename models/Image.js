import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  instaUrl: { type: String },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Image', imageSchema);
