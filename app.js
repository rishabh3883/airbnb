if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils//ExpressError.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/airbnb";


main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});


store.on("error",(err)=>{
   console.log("ERROR in MONGO SESION STORE",err);
});


const sessionOption = { 
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
       expires: Date.now() + 7*24*60*60*1000,
       maxAge: 7*24*60*60*1000,
       httpOnly :true,
    }
};




app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.successmsg= req.flash("success");
  res.locals.errormsg= req.flash("error");
  res.locals.currUser = req.user;
  next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"demo@gmail.com",
//         username:"demo-student"
//     });

//     let registerUser = await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// })



//Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

//Error Handler
app.use((req, res, next) =>{
    next(new ExpressError(404,"Page not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something Went Wrong"} = err;
    //res.status(statusCode).send(message);
    res.render("Error.ejs",{message});
});


if (require.main === module) {
    app.listen(3000, () => {
        console.log("working");
    });
}

module.exports = app;
