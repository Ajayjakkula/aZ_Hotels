const express=require("express")
const router=express.Router()
const wrapAsync = require("../utils/wrapAsync");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn,isOwner}=require("../middelware");
const path = require("path");



router.get("/", wrapAsync(async (req, res) => {
  let totaldata = await Listing.find({});
  res.render("home", { totaldata });
}));

router.get("/add/new",isLoggedIn, (req, res) => {
  res.render("addnewlisting.ejs");
});

router.post("/add/newdata", isLoggedIn, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;   // safe now because user is logged in
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}));

router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let totaldata = await Listing.findById(id).populate({
    path:"review",
    populate:{
      path:"author",
    },
  }).populate("owner"); // <-- populate reviews
  if (!totaldata) {
    throw new ExpressError(404, "Listing not found");
  }
 // console.log(totaldata)
  res.render("Briefinfo", { totaldata });
}));


router.get("/edit/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {

  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("editcurrent", { listing });
}));

router.patch("/edit/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {

  let { id } = req.params;
  let { title, description, price } = req.body;

  let updatedListing = await Listing.findByIdAndUpdate(
    id,
    { title, description, price },
    { new: true, runValidators: true }
  );

  if (!updatedListing) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("success","Updated Sucessfully :  ")
  res.redirect(`/listings/${id}`);
}));

router.delete("/delete/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success"," Listing  Deleted ")
  res.redirect("/listings");
}));

module.exports=router;
