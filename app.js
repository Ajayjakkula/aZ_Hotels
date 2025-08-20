const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./shema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const listRouters = require("./routes/listing.js");
const revRouters = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;  // ✅ Correct import
const User = require("./models/user.js");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const sessionOptions = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;  //  logged-in user available in templates
  next();
});

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/Hotel")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsmate);

// Demo User route (registering a fake user)
app.get("/demouser", async (req, res) => {
  let fakeuser = new User({
    email: "ajay@gmail.com",
    username: "Ajay" 
  });
  let registeredUser = await User.register(fakeuser, "helloworld");
  res.send(registeredUser);
});

// Routes
app.use("/listings", listRouters);
app.use("/listings/:id/reviews", revRouters);
app.use("/",userRouter)

// Catch-all (404 handler)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("Error.ejs", { message });
});

// Server
let port = 8080;
app.listen(port, () => console.log(`App is listening on port ${port}`));
