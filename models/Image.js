import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  title: String
});

export default mongoose.model('Image', imageSchema);
