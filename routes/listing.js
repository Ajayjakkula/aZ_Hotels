const express=require("express")
const router=express.Router()
const wrapAsync = require("../utils/wrapAsync");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn,isOwner}=require("../middelware");
const path = require("path");
const {renderindex,rendernewlisting,rendershowroute,rendereditroute,editroute,addroute,deleteroute}=require("../controllers/listing")


router.get("/", wrapAsync(renderindex));

router.get("/add/new",isLoggedIn,rendernewlisting );

router.post("/add/newdata", isLoggedIn, wrapAsync(addroute));


router.get("/:id", wrapAsync(rendershowroute));


router.get("/edit/:id", isLoggedIn,isOwner,wrapAsync(rendereditroute));

router.patch("/edit/:id", isLoggedIn,isOwner,wrapAsync(editroute));

router.delete("/delete/:id",isLoggedIn,isOwner, wrapAsync(deleteroute));

module.exports=router;
