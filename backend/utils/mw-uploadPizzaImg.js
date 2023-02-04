const path = require('path');
const { storagePizzaImg } = require('../cloudinary/index')

const multer = require('multer') // multer je middleware pro files
const uploadCampImg = multer({
    storage: storagePizzaImg,
    limits: { fileSize: 10000000, files: 1 },
    fileFilter: function (req, file, cb) {
        var typeArray = file.mimetype.split('/');
        var fileType = typeArray[1];
        if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
            cb(null, true);
        } else {
            res.status(400).json({ msg: 'Only images with .jpg, .png and .jpeg are allowed.' })
            cb(null, false);
        }
    }
}).array('image') //jak se campgrounds images ukládají // image značí key po kterým je file

// middle ware pro ukládání images s error callback
const mwUploadPizzaImg = (req, res, next) => {
    uploadCampImg(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // error od multer
            if (err.message === "File too large") {
                err.message = "Please upload images only with size less than 10MB"
            }
            res.status(413).json({ msg: 'Error while uploading image', error: err.message, err: 'img' })
        } else if (err) {
            // error který multer neočekává
            const sliceUrl = req.originalUrl.substring(0, req.originalUrl.indexOf('?'));
            res.status(400).json({ msg: 'Error while uploading image', err: err })
        } else {
            // Everything went fine.
            next();
        }
    });
}

module.exports = {
    mwUploadPizzaImg
}