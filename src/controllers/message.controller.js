const { SuccessResponse } = require('../core/success.response')
const MessageService = require('../services/message.service')

class MessageController {
    static createMessage = async (req, res, next) => {
        const response = await MessageService.createMessage({ sender: req.user.userId, ...req.body })
        new SuccessResponse({
            message: response.message,
            metadata: response.data,
        }).send(res)
    }

    static getMessages = async (req, res, next) => {
        const response = await MessageService.getMessages({ conversationId: req.params.conversationId })

        new SuccessResponse({
            message: response.message,
            metadata: response.data,
        }).send(res)
    }

    static recallMessage = async (req, res, next) => {
        new SuccessResponse({
            metadata: await MessageService.recallMessage({ msgId: req.params.msgId }),
        }).send(res)
    }

    static delMessage = async (req, res, next) => {
        new SuccessResponse({
            metadata: await MessageService.delMessage({ msgId: req.params.msgId }),
        }).send(res)
    }
}

module.exports = MessageController
