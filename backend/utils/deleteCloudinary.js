const { cloudinary } = require('../cloudinary/index')
const catchAsync = require('../utils/catchAsync')

const deleteCloudinary = async function (req, res, next) {
    if (req.files && req.files.length) { // pro odstranění souborů, který zbyly po erroru
        images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        for (let img of images) {
            try {
                await cloudinary.uploader.destroy(img.filename);
            } catch (e) {
                
            }
        }
    }
    return true
}

module.exports = {
    deleteCloudinary
}