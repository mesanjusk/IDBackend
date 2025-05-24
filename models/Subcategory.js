import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  subcategory_uuid: { type: String },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  categoryId: { type: String, required: true }
});

export default mongoose.model('Subcategory', subcategorySchema);
