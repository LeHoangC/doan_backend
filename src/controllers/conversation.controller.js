const { SuccessResponse } = require('../core/success.response')
const ConversationService = require('../services/conversation.service')

class ConversationController {
    static createConversation = async (req, res, next) => {
        const response = await ConversationService.getConversation({
            senderId: req.user.userId,
            receiverId: req.params.receiverId,
        })

        new SuccessResponse({
            message: response.message,
            metadata: response.data,
        }).send(res)
    }

    static getConversations = async (req, res, next) => {
        const response = await ConversationService.getConversations({
            userId: req.user.userId,
        })

        new SuccessResponse({
            message: response.message,
            metadata: response.data,
        }).send(res)
    }
}

module.exports = ConversationController
