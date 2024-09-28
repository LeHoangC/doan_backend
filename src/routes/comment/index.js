const express = require('express')
const asyncHandler = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const commentController = require('../../controllers/comment.controller')

const router = express.Router()

router.use(authentication)

router.get('/', asyncHandler(commentController.getCommentByParentId))
router.post('/', asyncHandler(commentController.createComment))
router.delete('/', asyncHandler(commentController.deleteComment))

module.exports = router
