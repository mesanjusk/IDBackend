import express from 'express';
import Size from '../models/Size.js';
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post('/add', async (req, res) => {
  const { name } = req.body;
   try{
        const s =await Size.findOne({ name: name })
       
        if(s){
            res.json("exist")
        }
        else{
          const newSize = new Size({
            name,
            size_uuid: uuid()
        });
        await newSize.save(); 
        res.json("notexist");
        }

    }
    catch(e){
      console.error("Error saving Size:", e);
      res.status(500).json("fail");
    }

});

 router.get("/GetSizeList", async (req, res) => {
    try {
      let data = await Size.find({});
  
      if (data.length)
        res.json({ success: true, result: data.filter((a) => a.name) });
      else res.json({ success: false, message: "Size Not found" });
    } catch (err) {
      console.error("Error fetching Size:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

export default router;
