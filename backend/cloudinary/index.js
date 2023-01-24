const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storagePizzaImg = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'pizzas',
        // format: ['jpeg', 'png', 'jpg'],
        // upload_preset: 'campgroundPhotos'
    }
});

module.exports = {
    cloudinary,
    storagePizzaImg
}