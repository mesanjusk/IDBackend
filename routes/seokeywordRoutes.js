import express from 'express';
import SEOKey from '../models/SEOKeyword.js';
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post('/add', async (req, res) => {
  const { name } = req.body;
   try{
        const reg=await SEOKey.findOne({ name: name })
       
        if(reg){
            res.json("exist")
        }
        else{
          const newSEOK = new SEOKey({
            name,
            seokeyword_uuid: uuid()
        });
        await newSEOK.save(); 
        res.json("notexist");
        }

    }
    catch(e){
      console.error("Error saving SEOKeyword:", e);
      res.status(500).json("fail");
    }

});

 router.get("/GetSEOKeyList", async (req, res) => {
    try {
      let data = await SEOKey.find({});
  
      if (data.length)
        res.json({ success: true, result: data.filter((a) => a.name) });
      else res.json({ success: false, message: "SEOKey Not found" });
    } catch (err) {
      console.error("Error fetching seokey:", err);
        res.status(500).json({ success: false, message: err });
    }
  });

export default router;
