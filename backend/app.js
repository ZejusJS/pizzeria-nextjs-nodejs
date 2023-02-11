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
const crypto = require('crypto');
const fs = require('fs')
const axios = require('axios')

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { mwIsAdmin, mwIsAdminGet } = require('./utils/mw-isAdmin')
const mwFindUser = require('./utils/mw-findUser')
const getRetezec = require('./utils/func/getRetezec')

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
    console.log('user... ', req.user)
    // console.log('Signed cookies.... ', req.signedCookies)
    // console.log('Cookies.... ', req.cookies)
    console.log('------------------------')
    next()
})

app.use('/pizza', pizzaRoute)
app.use('/user', userRoute)// mwFindUser
app.use('/cart', cartRoute) // mwFindUser
app.use('/admin', mwIsAdmin, adminRoute) // mwFindUser

const CSOB_PRIVATE = fs.readFileSync('./keys/rsa_A3492UfuSm.key', 'utf8')
const CSOB_PUBLIC = fs.readFileSync('./keys/rsa_A3492UfuSm.txt', 'utf8')

app.post('/signature', catchAsync(async function (req, res, next) {
    const dt = new Date().toISOString().replace(/(\.\d{3})|[^\d]/g, '')
    const data = {
        merchantId: 'A3492UfuSm',
        orderNo: Math.floor(Math.random() * 9999999999) + 1,
        dttm: dt,
        payOperation: 'payment',
        payMethod: 'card',
        totalAmount: '20000',
        currency: 'CZK',
        closePayment: true,
        returnUrl: 'http://localhost:3000/',
        returnMethod: 'GET',
        cart: [
            {
                "name": "Wireless headphones",
                "quantity": 5,
                "amount": 20000
            },
            {
                "name": "Shipping",
                "quantity": 1,
                "amount": 0,
                "description": "DPL"
            }
        ],
        "customer": {
            "name": "Jan Novák",
            "email": "jan.novak@example.com",
            "mobilePhone": "+420.800300300",
        },
        "order": {
            "type": "purchase",
            "availability": "now",
            "delivery": "shipping",
            "deliveryMode": "1",
            "addressMatch": true,
            "billing": {
                "address1": "Karlova 1",
                "city": "Praha",
                "zip": "11000",
                "country": "CZE",
            }
        },
        language: 'cs'
    }

    const RETEZEC = getRetezec(data)
    const sign = crypto.sign("SHA256", RETEZEC, CSOB_PRIVATE);
    const signature = sign.toString('base64');
    data.signature = signature

    let resData = {}
    await axios({
        method: 'post',
        url: 'https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/init',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then(res => resData = res.data)
        .catch(e => console.log(e))

    let merchantIdBase64url = encodeURIComponent(data.merchantId)
    let payIdBase64url = encodeURIComponent(resData.payId)
    let dttmBase64url = encodeURIComponent(resData.dttm)

    const RETEZEC_PROCESS = getRetezec({ merchantId: data.merchantId, payId: resData.payId, dttm: resData.dttm })
    const signProcess = crypto.sign("SHA256", RETEZEC_PROCESS, CSOB_PRIVATE);
    const signatureProcess = signProcess.toString('base64');
    const signatureProcessUri = encodeURIComponent(signatureProcess)

    let url = `https://iapi.iplatebnibrana.csob.cz/api/v1.9/payment/process/${merchantIdBase64url}/${payIdBase64url}/${dttmBase64url}/${signatureProcessUri}`

    console.log(url)
    res.redirect(url)
}))

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