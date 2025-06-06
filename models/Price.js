import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  price_uuid: { type: String }, 
  name: { type: Number, required: true },
});

export default mongoose.model('Price', priceSchema);
