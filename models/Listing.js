import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: String,
  category: String,
  subcategory: String,
  price: Number,
  instagramUrl: String,
  size: String,
  religions: String,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
  discount: Number,
  MOQ: Number,
  Description: String,
  favorite: Number,
  images: [String], 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Listing', listingSchema);
