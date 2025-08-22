const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middelware");
const { 
  renderindex,
  rendernewlisting,
  rendershowroute,
  rendereditroute,
  editroute,
  addroute,
  deleteroute
} = require("../controllers/listing");

router.get("/", wrapAsync(renderindex));

router.route("/add/new")
  .get(isLoggedIn, rendernewlisting)
  .post(isLoggedIn, wrapAsync(addroute));

router.get("/:id", wrapAsync(rendershowroute));

router.route("/edit/:id")
  .get(isLoggedIn, isOwner, wrapAsync(rendereditroute))
  .patch(isLoggedIn, isOwner, wrapAsync(editroute));

router.delete("/delete/:id", isLoggedIn, isOwner, wrapAsync(deleteroute));

module.exports = router;
