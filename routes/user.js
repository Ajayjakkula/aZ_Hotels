const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware");
const { 
  rendersignup, 
  signuproute, 
  renderlogin, 
  loginroute, 
  logoutroute 
} = require("../controllers/users");

router.route("/signup")
  .get(rendersignup)
  .post(signuproute);

router.route("/login")
  .get(renderlogin)
  .post(loginroute);

router.get("/logout", logoutroute);

module.exports = router;
