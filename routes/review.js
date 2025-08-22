const express=require("express")
const router=express.Router({mergeParams:true})
const Listing = require("../models/listing");
const Review=require("../models/review.js")
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn,isAuthor}=require("../middelware.js")


router.post("/", isLoggedIn,async (req, res) => {

  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author=req.user._id;
  await newreview.save();
  listing.review.push(newreview);
  await listing.save();
  res.redirect(`/listings/${req.params.id}`);
});

router.delete("/delete/:idd",isLoggedIn,isAuthor,async(req,res)=>{
  if(!req.isAuthenticated()){
    req.flash("error","You Must Login To access this");
    return res.redirect("/login")
  }
let {idd}=req.params;
let {id}=req.params;
let rev=await Review.findByIdAndDelete(idd);
res.redirect(`/listings/${id}`)
})

module.exports=router;