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

const listroutes=require("./routes/listing.js")
const revroutes=require("./routes/review.js")

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

app.use("/listings",listroutes);

app.use("/listings/:id/reviews",revroutes);

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
