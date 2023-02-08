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
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const bodyparser = require('body-parser')

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { mwIsAdmin, mwIsAdminGet } = require('./utils/mw-isAdmin')
const mwFindUser = require('./utils/mw-findUser')

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
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
    name: "mammamia",
    secret: process.env.SECRET, // 'secretword'
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 20,
        sameSite: 'strict'
    }
}));

const User = require('./models/user');

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND
}))
app.use(cookieParser(process.env.SECRET))
app.use(bodyparser.json())

app.use(catchAsync(async function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) req.user = undefined
    else {
        jwt.verify(token, process.env.SECRET_JWT_ACCESS, (err, user) => {
            if (err) req.user = undefined
            else req.user = user
        })
    }
    next()
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const pizzaRoute = require('./routes/pizza')
const userRoute = require('./routes/user')
const cartRoute = require('./routes/cart')
const adminRoute = require('./routes/admin')

app.use(function (req, res, next) {
    console.log('------------------------')
    // console.log('isAuthenticated... ', req.isAuthenticated())
    // console.log('cookies... ', req.cookies)
    // console.log('passport... ', req.passport)
    // console.log('Original url... ', req.originalUrl)
    // console.log('user... ', req.user)
    // console.log('Signed cookies.... ', req.signedCookies)
    // console.log('Cookies.... ', req.cookies)
    console.log('------------------------')
    next()
})

app.use('/pizza', pizzaRoute)
app.use('/user', userRoute)// mwFindUser
app.use('/cart', cartRoute) // mwFindUser
app.use('/admin', mwIsAdmin, adminRoute) // mwFindUser

app.use(async (err, req, res, next) => {
    // console.log(err)
    try {
        const { status = 500 } = err;
        if (!err.message) err.message = 'Internal Server Error';
        console.log(err);

        if (req.files && req.files.length) { // pro odstranění souborů, který zbyly po erroru
            images = req.files.map(f => ({ url: f.path, filename: f.filename }));
            for (let img of images) {
                await cloudinary.uploader.destroy(img.filename);
            }
        }

        res.status(status).json(err)
    } catch (e) {
        console.log('ERROR!!!!!!!!!!!!!', e)
        res.status(500).json({ msg: 'Server Error' })
    }
});


app.listen(port, () => {
    console.log('LISTENNING ON PORT:', port);
});