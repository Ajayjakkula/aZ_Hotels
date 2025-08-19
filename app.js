const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema}=require("./shema.js")
const Review=require("./models/review.js")

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/Hotel")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsmate);

// Routes
app.get("/listings", wrapAsync(async (req, res) => {
  let totaldata = await Listing.find({});
  res.render("home", { totaldata });
}));

app.get("/listings/add/new", (req, res) => {
  res.render("addnewlisting.ejs");
});

app.post("/listings/add/newdata", wrapAsync(async (req, res) => {
  // const result = listingSchema.validate(req.body);
  await Listing.create(req.body);
  res.redirect("/listings");

  //suppose if you have not enterd valid description
  //const newlisting = new Listing(req.body.listing)
  //if(!newlisting.descrption){
  //throw new ExpressError(404,"Send Valid Description")
  //}
}));

app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let totaldata = await Listing.findById(id);
  if (!totaldata) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("Briefinfo", { totaldata });
}));

app.get("/listings/edit/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("editcurrent", { listing });
}));

app.patch("/listings/edit/:id", wrapAsync(async (req, res) => {
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

app.delete("/listings/delete/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

app.post("/listings/reviews/:id", async (req, res) => {
  let listing=await Listing.findById(req.params.id);
  let newreview=new Review(req.body.review);
  listing.review.push(newreview);
  await newreview.save();
  await listing.save();
   res.send("Added")
});

// Catch-all (404 handler)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.render("Error.ejs",{message})
});




// Server
let port = 8080;
app.listen(port, () => console.log(`App is listening on port ${port}`));
