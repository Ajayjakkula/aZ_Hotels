const passport=require("passport")
module.exports.rendersignup=(req,res)=>{
    res.render("users/signup");
};
module.exports.signuproute=async (req,res)=>{
    try{
    let{username,email,password}=req.body;
   // console.log(username,email,password);
   const newUser=new User({email,username})
   await User.register(newUser,password)
   req.flash("success","Welcome to aZ-Hotels");
   res.redirect("/login")
    }catch(e){
        req.flash("error","username already Exist");
        res.redirect("/signup")
    }
}

module.exports.renderlogin=(req,res)=>{
    res.render("users/login");
};

module.exports.loginroute=  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),(req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logoutroute=(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      next(err);// if error happens while logging out, pass it to error handler
    }
    req.flash("success","Logged Out Successfully ");
    res.redirect("/listings")
  })
}