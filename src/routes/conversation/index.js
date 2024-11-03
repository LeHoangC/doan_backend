const express = require('express')
const asyncHandler = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const conversationController = require('../../controllers/conversation.controller')

const router = express.Router()

router.use(authentication)

router.get('/', asyncHandler(conversationController.getConversations))
router.get('/:receiverId', asyncHandler(conversationController.createConversation))

module.exports = router
