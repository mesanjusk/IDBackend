import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  images: [String],
  title: String,
  category: String,
  subcategory: String,
  price: Number,
  instagramUrl: String,
  size: String,
  religions: String,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String
});

export default mongoose.model('Image', imageSchema);
