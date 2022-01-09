const User = require("../models/user");


module.exports.renderRegisterForm = (req, res) => {
    res.render("users/rejister")
}
module.exports.registerUser = async (req, res, next) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user,password)
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success" ,"Welcome to oboCare");
            res.redirect("/campgrounds")
        })
        
    }catch (e) {
        req.flash("error", e.message);
        res.redirect("register")
    }
    
    
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login")
}

module.exports.logUserIn = async (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl)
    
}

module.exports.logUserOut = (req, res) =>{
    req.logout();
    req.flash("error", "Goodbye");
    res.redirect("/campgrounds")
}