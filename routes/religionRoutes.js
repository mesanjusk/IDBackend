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

export default router;
