const express = require('express')
const asyncHandler = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const { uploadFile } = require('../../middleware')
const PostController = require('../../controllers/post.controller')

const router = express.Router()
router.get('/', asyncHandler(PostController.getAllPosts))
router.get('/gen-caption', asyncHandler(PostController.genCaptionWithAi))

router.use(authentication)

router.get('/user/:userSlug', asyncHandler(PostController.getUserPosts))
router.get('/following-and-friend', asyncHandler(PostController.getFollowingAndFriendPosts))
router.get('/search/:keySearch', asyncHandler(PostController.searchPost))

router.post('/', uploadFile.single('picture'), asyncHandler(PostController.createPost))
router.post('/like/:id', asyncHandler(PostController.likePost))

router.delete('/:id', asyncHandler(PostController.deletePost))

module.exports = router
