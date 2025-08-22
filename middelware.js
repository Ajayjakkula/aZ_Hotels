const Listing=require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must login to access this");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not allowed to do this");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


module.exports.isAuthor = async (req, res, next) => {
  let { id ,idd} = req.params;
  let review = await Review.findById(idd);

  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not allowed to do this");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
