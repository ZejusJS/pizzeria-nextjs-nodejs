if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const port = process.env.PORT || 8000;
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const QRCode = require('qrcode')
const speakeasy = require('speakeasy')
const multer = require('multer') // multer je middleware pro files
const os = require("os");
const cors = require('cors')
const { cloudinary } = require('./cloudinary/index')
const { storageCampImg } = require('./cloudinary/index')

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

const dbUrl = process.env.DB_URL  // 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});
mongoose.set('strictQuery', true);

const sessionStore = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 60 * 60 * 10, // v SEKUNDÁCH!!!!!!
    crypto: {
        secret: process.env.SECRET // 'secretword'
    }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true) // pro získání reálné IP adresy z req.ip
app.engine('ejs', ejsMate);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('method-override'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: sessionStore,
    name: "mamma-mia",
    secret: process.env.SECRET, // 'secretword'
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 5
    }
}));

const User = require('./models/user');

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' // změnit v produkci
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const pizzaRoute = require('./routes/pizza')
const userRoute = require('./routes/user')

app.use('/pizza', pizzaRoute)
app.use('/user', userRoute)

app.use(async (err, req, res, next) => {
    try {
        const { status = 500 } = err;
        if (!err.message) err.message = 'Internal Server Error';
        console.log(err);

        res.status(status).json(err)
    } catch (e) {
        console.log('ERROR!!!!!!!!!!!!!', e)
        res.status(400).json({ msg: 'Server Error' })
    }
});


app.listen(port, () => {
    console.log('LISTENNING ON PORT:', port);
});