import Image from '../models/Image.js';

export const saveImageMetadata = async (req, res) => {
  try {
    const { title, category, instaUrl } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    // Check if Cloudinary URL is available in the request file object
    const { url, public_id } = req.file;

    if (!url || !public_id) {
      return res.status(400).json({ message: 'Cloudinary upload failed.' });
    }

    // Save image metadata to the database
    const image = new Image({
      title,
      category,
      instaUrl,
      url, // Use the Cloudinary URL
      public_id, // Store Cloudinary public_id
    });

    await image.save();

    res.status(201).json({ message: 'Image uploaded successfully', image });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error while uploading', error });
  }
};
