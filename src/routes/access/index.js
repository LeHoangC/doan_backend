const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.post('/signup', asyncHandler(accessController.signUp))
router.post('/login', asyncHandler(accessController.login))

router.use(authentication)

router.post('/logout', asyncHandler(accessController.logout))
router.post('/refreshToken', asyncHandler(accessController.handleRefreshToken))

module.exports = router
