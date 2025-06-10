import express from 'express';
import Religion from '../models/Religion.js';
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post('/add', async (req, res) => {
  const { name } = req.body;
   try{
        const reg=await Religion.findOne({ name: name })
       
        if(reg){
            res.json("exist")
        }
        else{
          const newReg = new Religion({
            name,
            religion_uuid: uuid()
        });
        await newReg.save(); 
        res.json("notexist");
        }

    }
    catch(e){
      console.error("Error saving Religion:", e);
      res.status(500).json("fail");
    }

});

 router.get("/GetReligionList", async (req, res) => {
    try {
      let data = await Religion.find({});
  
      if (data.length)
        res.json({ success: true, result: data.filter((a) => a.name) });
      else res.json({ success: false, message: "Religion Not found" });
    } catch (err) {
      console.error("Error fetching religion:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

router.get('/:id', async (req, res) => {
  const { id } = req.params; 

  try {
      const user = await Religion.findById(id);  

      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'Religion not found',
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

router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
   
    const updateData = { name  };
    
    const religion = await Religion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!religion) {
      return res.status(404).json({ message: 'Religion not found' });
    }

    res.json(religion);
  } catch (err) {
    console.error('Error updating religion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Religion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Religion deleted' });
  } catch (err) {
    console.error('Error deleting Religion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
