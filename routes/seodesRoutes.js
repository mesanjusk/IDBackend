import express from 'express';
import SEODes from '../models/SEODes.js';
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post('/add', async (req, res) => {
  const { name } = req.body;
   try{
        const reg=await SEODes.findOne({ name: name })
       
        if(reg){
            res.json("exist")
        }
        else{
          const newSEOD = new SEODes({
            name,
            seodes_uuid: uuid()
        });
        await newSEOD.save(); 
        res.json("notexist");
        }

    }
    catch(e){
      console.error("Error saving SEODes:", e);
      res.status(500).json("fail");
    }

});

 router.get("/GetSEODesList", async (req, res) => {
    try {
      let data = await SEODes.find({});
  
      if (data.length)
        res.json({ success: true, result: data.filter((a) => a.name) });
      else res.json({ success: false, message: "SEODes Not found" });
    } catch (err) {
      console.error("Error fetching seodes:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

export default router;
