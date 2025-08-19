const express=require("express")
const router=express.Router()
const wrapAsync = require("../utils/wrapAsync");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");


router.get("/", wrapAsync(async (req, res) => {
  let totaldata = await Listing.find({});
  res.render("home", { totaldata });
}));

router.get("/add/new", (req, res) => {
  res.render("addnewlisting.ejs");
});

router.post("/add/newdata", wrapAsync(async (req, res) => {
  // const result = listingSchema.validate(req.body);
  await Listing.create(req.body);
  res.redirect("/listings");

  //suppose if you have not enterd valid description
  //const newlisting = new Listing(req.body.listing)
  //if(!newlisting.descrption){
  //throw new ExpressError(404,"Send Valid Description")
  //}
}));

router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let totaldata = await Listing.findById(id).populate("review"); // <-- populate reviews
  if (!totaldata) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("Briefinfo", { totaldata });
}));


router.get("/edit/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("editcurrent", { listing });
}));

router.patch("/edit/:id", wrapAsync(async (req, res) => {
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

  res.redirect(`/listings/${id}`);
}));

router.delete("/delete/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports=router;
