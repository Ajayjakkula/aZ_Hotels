const express=require("express")
const router=express.Router()
const User=require("../models/user")
const passport=require("passport")
const {saveRedirectUrl}=require("../middelware")
const {rendersignup,signuproute,renderlogin,loginroute,logoutroute}=require("../controllers/users")


router.get("/signup",rendersignup);


router.post("/signup",signuproute)



router.get("/login",renderlogin);

router.post(
  "/login",saveRedirectUrl,loginroute);


router.get("/logout",logoutroute)


module.exports=router