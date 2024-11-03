const { Types } = require('mongoose')
const messageModel = require('../models/message')

class MessageService {
    static createMessage = async ({ conversationId, sender, text }) => {
        const newMessage = await messageModel.create({
            conversationId: new Types.ObjectId(conversationId),
            sender: new Types.ObjectId(sender),
            text,
        })

        return {
            message: 'Created message',
            data: newMessage,
        }
    }

    static getMessages = async ({ conversationId }) => {
        const messages = await messageModel.find({
            conversationId,
        })

        return {
            message: 'Get messages',
            data: messages,
        }
    }
}

module.exports = MessageService
