const express = require('express')
const asyncHandler = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils')
const messageController = require('../../controllers/message.controller')

const router = express.Router()

router.use(authentication)

router.get('/:conversationId', asyncHandler(messageController.getMessages))
router.post('/', asyncHandler(messageController.createMessage))
router.post('/:msgId', asyncHandler(messageController.recallMessage))
router.delete('/:msgId', asyncHandler(messageController.delMessage))

module.exports = router
