const catchAsync = require('../../utils/catchAsync')
const axios = require('axios')


module.exports.mwRecaptcha = catchAsync(async function (req, res, next) {
    const { recaptchaToken } = req.body;

    let response
    let error
    await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`
    )
        .then(res => response = res.data)
        .catch(e => error = e.response)

    if (response?.success) {
        next()
    } else {
        res.status(400).json({ msg: 'Recaptcha failed', code: 550 })
    }
})

module.exports.mwRecaptchaAuth = catchAsync(async function (req, res, next) {
    const { recaptchaToken } = req.body;

    let response
    let error
    await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_AUTH}&response=${recaptchaToken}`
    )
        .then(res => response = res.data)
        .catch(e => error = e.response)

    if (response?.success) {
        next()
    } else {
        res.status(400).json({ msg: 'Recaptcha failed', code: 550 })
    }
})