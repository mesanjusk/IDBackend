import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

export default mongoose.model('Banner', bannerSchema);
