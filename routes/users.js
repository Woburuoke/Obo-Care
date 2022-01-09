const express = require("express");
const router = express.Router();
const appError = require("../utils/AppError");
const wrapAsync = require("../utils/wrapAsync");
const Controller = require("../controllers/userController")
const passport = require("passport")


router.route("/register")
.get(Controller.renderRegisterForm)
.post(wrapAsync(Controller.registerUser))

 
router.route("/login")
.get(Controller.renderLoginForm )
.post(passport.authenticate("local",{ failureFlash: true , failureRedirect: "/login"}),
wrapAsync(Controller.logUserIn))




router.get("/logout",Controller.logUserOut )


module.exports = router