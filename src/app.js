const path = require('path')
require('dotenv').config()
const express = require('express')
const compression = require('compression')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { rateLimit } = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')

const app = express()

app.use('/assets', express.static(path.join(__dirname, '../public/assets')))
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
        limit: '30mb',
    })
)

// init middlewares

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        credentials: true,
    })
)
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

const redis = require('./dbs/init.ioredis')

redis.init({
    REDIS_HOST: 'redis',
})

// init db
// redis.init({
//     REDIS_HOST: 'central-reptile-63263.upstash.io',
//     REDIS_USERNAME: 'default',
//     REDIS_PASSWORD: 'AfcfAAIjcDEzY2NlZjhmMDJhMDU0N2Q3OWU3NzZiMDI5N2E2YjMyM3AxMA',
// })


require('./dbs/init.mongodb')

// router
app.get('/ping', (req, res) => {
    res.json({
        message: 'PONG PONG',
    })
})

app.use('/v1/api', require('./routes'))

app.use((req, res, next) => {
    const error = new Error('Not found!')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: statusCode,
        metadata: {},
        message: error.message || 'Internal Server Error',
        // stack: error.stack,
    })
})

module.exports = app
