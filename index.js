if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const appError = require("./utils/AppError");
const wrapAsync = require("./utils/wrapAsync");
const {campgroundSchema, reviewSchema} = require("./schemas");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");
const registerRoutes = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const dbUrl = process.env.DB_URL

const MongoDBStore = require("connect-mongo");







 
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const User = require("./models/user");
const Review = require("./models/review");
const AppError = require("./utils/AppError");
const MongoStore = require("connect-mongo");

app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));



 

app.use(express.urlencoded({ extended: true}));
app.use(express.json())
app.use(methodOverride('_method'));


// 'mongodb://localhost:27017/oboCare'
 
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


    
app.listen(8080, () =>{
    console.log("We Outside")
})



app.use(express.static(path.join(__dirname,"public")));
// app.use(express.static(path.join(path.resolve(__dirname, "public"))))

// console.log(path.join(path.resolve(__dirname, "public")))
// console.log(path.join(__dirname,"public", "/"))

app.use(mongoSanitize())

const secret = process.env.SECRET || "forTestOnly"

const store =  MongoDBStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: "forTestOnly"
      },
    touchAfter: 24 * 60 * 60
})

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: "session",
    secret: "forTestOnly",
    resave:false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/duhxhaszn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();

})

app.use("/campgrounds",campgroundRoutes);
app.use("/campground/:id/reviews",reviewRoutes);
app.use("",registerRoutes);

 

app.get("/", (req, res)=>{
    res.render("Home");

})




 
 app.all("*", (res, req, ) => {
    
     throw new AppError("Page not Found")


})

app.use((err, req, res, next) =>{
    console.log(err)
    const { status = 500 } = err;
    if(!err.message) err.message = "Something went Wrong"
    res.status(status).render("error",{ err })
})

  