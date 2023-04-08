const { RateLimiterMemory } = require('rate-limiter-flexible');
const catchAsync = require('../utils/catchAsync')

const maxCardPoints = 1
const rateLimiterCard = new RateLimiterMemory({
    points: maxCardPoints,
    duration: 60,
    blockDuration: 20
});

module.exports.mwCardPaymentPoints = catchAsync(async function (req, res, next) {
    const key = req.user.email
    const cpByUser = await rateLimiterCard.get(key)

    console.log('cpByUser.... ',cpByUser)
    if (cpByUser !== null && cpByUser.consumedPoints > maxCardPoints) {
        return res.status(429).json({ code: 500 })
    } else {
        try {
            await rateLimiterCard.consume(key, 1)
        } catch(e) {
            return res.status(429).json({ code: 500 })
        }
        next()
    }
})