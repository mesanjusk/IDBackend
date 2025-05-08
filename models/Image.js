import mongoose from 'mongoose';

// Define the schema for the image model
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // URL of the image
    public_id: { type: String, required: true }, // Cloudinary public ID
    title: { type: String, required: true }, // Title for the image
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

// Export the Image model based on the schema
export default mongoose.model('Image', imageSchema);
