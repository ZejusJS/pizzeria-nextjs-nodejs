const catchAsync = require('../utils/catchAsync')

const mwIsAdminGet = catchAsync(async function (req, res, next) {
    const user = req.user
    // console.log(user)
    if (user) {
        if (user.roles?.admin === true) {
            res.status(200).json({ msg: 'Allowed' })
        } else {
            res.status(403).json({ msg: 'Not allowed' })
        }
    } else {
        res.status(401).json({ msg: 'Not logged in' })
    }
})

const mwIsAdmin = catchAsync(async function (req, res, next) {
    const user = req.user
    // console.log(user)
    if (user) {
        if (user.roles?.admin === true) {
            next()
        } else {
            res.status(403).json({ msg: 'Not allowed' })
        }
    } else {
        res.status(401).json({ msg: 'Not logged in' })
    }
})


module.exports = {
    mwIsAdminGet,
    mwIsAdmin
}