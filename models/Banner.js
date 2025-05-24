import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  banner_uuid: { type: String },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

export default mongoose.model('Banner', bannerSchema);
