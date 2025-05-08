import mongoose from 'mongoose';

// MongoDB schema for images
const imageSchema = new mongoose.Schema({
  url: String,          // Image URL (from Cloudinary or local path)
  public_id: String,    // Public ID (from Cloudinary or filename)
  title: String,        // Image title
  category: String,     // Image category
  instaUrl: String,     // Instagram URL for reference (optional)
});

export default mongoose.model('Image', imageSchema);
