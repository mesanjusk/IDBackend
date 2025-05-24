import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  subcategory_uuid: { type: String },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

export default mongoose.model('Subcategory', subcategorySchema);
