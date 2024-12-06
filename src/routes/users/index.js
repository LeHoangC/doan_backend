const express = require('express')
const asyncHandler = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const { uploadFile } = require('../../middleware')
const UserController = require('../../controllers/user.controller')

const router = express.Router()

router.use(authentication)

router.get('/:slug', asyncHandler(UserController.getUser))
router.get('/friends/:userId', asyncHandler(UserController.getFriends))
router.get('/following/:userId', asyncHandler(UserController.getFollowing))
router.get('/requester/:userId', asyncHandler(UserController.getRequester))
router.get('/recipient/:userId', asyncHandler(UserController.getRecipient))
router.get('/not-friend/:userId', asyncHandler(UserController.getAllUserNotFriend))

router.post('/add-friend', asyncHandler(UserController.addFriend))
router.post('/accept-friend', asyncHandler(UserController.acceptFriend))
router.post('/remove-friend', asyncHandler(UserController.removeFriend))

router.patch('/upload-avatar', uploadFile.single('picture'), asyncHandler(UserController.uploadAvatar))
router.patch('/', asyncHandler(UserController.updateUser))

module.exports = router
