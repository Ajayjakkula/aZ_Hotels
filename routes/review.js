const express=require("express")
const router=express.Router({mergeParams:true})
const Listing = require("../models/listing");
const Review=require("../models/review.js")
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn,isAuthor}=require("../middelware.js")

const{addreview,deletereview}=require("../controllers/reviews.js")


router.post("/", isLoggedIn,addreview);

router.delete("/delete/:idd",isLoggedIn,isAuthor,deletereview)

module.exports=router;