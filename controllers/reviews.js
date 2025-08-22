const Review=require("../models/review")

module.exports.addreview=async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author=req.user._id;
  await newreview.save();
  listing.review.push(newreview);
  await listing.save();
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deletereview=async(req,res)=>{
  if(!req.isAuthenticated()){
    req.flash("error","You Must Login To access this");
    return res.redirect("/login")
  }
let {idd}=req.params;
let {id}=req.params;
let rev=await Review.findByIdAndDelete(idd);
res.redirect(`/listings/${id}`)
};