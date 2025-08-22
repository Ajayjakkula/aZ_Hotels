const Listing=require("../models/listing")

module.exports.renderindex=async (req, res) => {
  let totaldata = await Listing.find({});
  res.render("home", { totaldata });
};

module.exports.rendernewlisting=async (req, res) => {
  res.render("addnewlisting.ejs");
};

module.exports.addroute=async (req, res) => {
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;   // safe now because user is logged in
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.rendershowroute=async (req, res) => {
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
};

module.exports.rendereditroute=async (req, res) => {

  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("editcurrent", { listing });
};

module.exports.editroute=async (req, res) => {

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
};

module.exports.deleteroute=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success"," Listing  Deleted ")
  res.redirect("/listings");
};

