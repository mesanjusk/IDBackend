import express from 'express';
import SEOTitle from '../models/SEOTitle.js';
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post('/add', async (req, res) => {
  const { name } = req.body;
   try{
        const reg=await SEOTitle.findOne({ name: name })
       
        if(reg){
            res.json("exist")
        }
        else{
          const newSEOT = new SEOTitle({
            name,
            seotitle_uuid: uuid()
        });
        await newSEOT.save(); 
        res.json("notexist");
        }

    }
    catch(e){
      console.error("Error saving SEOTitle:", e);
      res.status(500).json("fail");
    }

});

 router.get("/GetSEOTitleList", async (req, res) => {
    try {
      let data = await SEOTitle.find({});
  
      if (data.length)
        res.json({ success: true, result: data.filter((a) => a.name) });
      else res.json({ success: false, message: "SEOTitle Not found" });
    } catch (err) {
      console.error("Error fetching seotitle:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

export default router;
