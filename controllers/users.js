const User=require("../models/user")
module.exports.rendersignup = (req, res) => {
  res.render("users/signup");
};



module.exports.signuproute = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    await User.register(newUser, password);
    req.flash("success", "Welcome to aZ-Hotels");
    res.redirect("/login");
  } catch (e) {
    req.flash("error", e.message);  
    res.redirect("/signup");
  }
};

module.exports.renderlogin = (req, res) => {
  res.render("users/login");
};

module.exports.loginroute = (req, res) => {
  req.flash("success", "Welcome back!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutroute = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listings");
  });
};
