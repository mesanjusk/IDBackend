import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  instaUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);
