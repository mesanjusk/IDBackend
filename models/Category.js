// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category_uuid: { type: String },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

export default mongoose.model('Category', categorySchema);
