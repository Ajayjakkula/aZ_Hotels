const express=require("express")
const router=express.Router({mergeParams:true})
const Listing = require("../models/listing");
const Review=require("../models/review.js")
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError");


router.post("/", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  await newreview.save();
  listing.review.push(newreview);
  await listing.save();
  res.redirect(`/listings/${req.params.id}`);
});

router.delete("/delete/:idd",async(req,res)=>{
let {idd}=req.params;
let {id}=req.params;
let rev=await Review.findByIdAndDelete(idd);
res.redirect(`/listings/${id}`)
})

module.exports=router;