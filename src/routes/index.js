const express = require('express')
// const { apiKey, permission } = require('../auth/checkAuth')

const router = express.Router()

// router.use('/v1/api/upload', require('./upload'))
// router.use('/v1/api/message', require('./message'))
router.use('/comment', require('./comment'))
router.use('/users', require('./users'))
router.use('/posts', require('./posts'))
router.use('/auth', require('./access'))

module.exports = router
