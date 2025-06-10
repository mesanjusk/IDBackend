import express from 'express';
import Configuration from '../models/Configuration.js';
import { v4 as uuid } from "uuid";
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'categories',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage });

router.post("/add", upload.single('logo'), async (req, res) => {
  try {
    const { name, email, phone, address, fb, insta, twitter, linkedIn } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json("Logo image is required.");
    
    const imageUrl = file.path;

    const check = await Configuration.findOne({ phone });

    if (check) {
      res.json("exist");
    } else {
      const newConfi = new Configuration({
        name,
        logo: imageUrl,
        email,
        phone,
        address,
        Confi_uuid: uuid(),
        fb, 
        insta, 
        twitter, 
        linkedIn
      });
      await newConfi.save();
      res.json("notexist");
    }
  } catch (e) {
    console.error("Error saving data:", e);
    res.status(500).json("fail");
  }
});


  router.get("/GetConfiList", async (req, res) => {
    try {
      let data = await Configuration.find({});
  
      if (data.length)
        res.json({ success: true, result: data.filter((a) => a.name) });
      else res.json({ success: false, message: "Confi Not found" });
    } catch (err) {
      console.error("Error fetching data:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

router.get('/:id', async (req, res) => {
  const { id } = req.params; 

  try {
      const user = await Configuration.findById(id);  

      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'Confi not found',
          });
      }

      res.status(200).json({
          success: true,
          result: user,
      });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
          success: false,
          message: 'Error fetching data',
          error: error.message,
      });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, address, fb, insta, twitter, linkedIn } = req.body;
    const file = req.file;

    const updateData = { name, email, phone, address, fb, insta, twitter, linkedIn  };

    if (file) {
      updateData.logo = file.path;
    }

    const config = await Configuration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }

    res.json(config);
  } catch (err) {
    console.error('Error updating config:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Configuration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Config deleted' });
  } catch (err) {
    console.error('Error deleting config:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

  export default router;
