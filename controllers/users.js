const User = require("../models/user.js");
const {listingSchema } = require("../schema.js");

module.exports.renderSignupform = (req,res)=>{
    res.render("user/signup.ejs");
};


module.exports.signup =async(req,res)=>{
    try {
        let{username,email,password} = req.body;
        newUser = new User({email,username});
        const registeredUse = await User.register(newUser,password);
        console.log(registeredUse);
        req.login(registeredUse,(err)=>{
            if(err){
            return next(err);
            }
            req.flash("success","Welcome to WanderLust")
        res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error",error.message);
        res.render("/signup");
    }
  
};


module.exports.renderLoginForm =  (req,res)=>{
    res.render("user/login.ejs");
};


module.exports.login = async(req,res)=>{
        req.flash("success","wlc to WanderLust you are login")
        res.redirect(res.locals.redirectUrl || "/listings");
};


module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    });
};