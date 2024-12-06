const { default: rateLimit } = require('express-rate-limit')
const { default: RedisStore } = require('rate-limit-redis')
const multer = require('multer')
const redis = require('../dbs/init.ioredis')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const uploadFile = multer({ storage })

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Limit đã đạt giới hạn.",
    store: new RedisStore({
        sendCommand: (...args) => redis.getIoRedis().instanceConnect.call(...args),
    }),
})


module.exports = {
    uploadFile,
    limiter
}
