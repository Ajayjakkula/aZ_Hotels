const express=require("express")
const router=express.Router()
const User=require("../models/user")
const passport=require("passport")


router.get("/signup",(req,res)=>{
    res.render("users/signup");
});


router.post("/signup",async (req,res)=>{
    try{
    let{username,email,password}=req.body;
   // console.log(username,email,password);
   const newUser=new User({email,username})
   await User.register(newUser,password)
   req.flash("success","Welcome to aZ-Hotels");
   res.redirect("/listings")
    }catch(e){
        req.flash("error","username already Exist");
        res.redirect("/signup")
    }
})



router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);


module.exports=router