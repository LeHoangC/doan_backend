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

    static recallMessage = async ({ msgId }) => {
        return await messageModel.findByIdAndUpdate(msgId, {
            isRecall: true
        }, { new: true })
    }

    static delMessage = async ({ msgId }) => {
        console.log({ msgId });

        return await messageModel.findByIdAndDelete(msgId)
    }

    static getMessages = async ({ conversationId }) => {
        const messages = await messageModel.find({
            conversationId,
        }).sort({ createdAt: 1 })

        return {
            message: 'Get messages',
            data: messages,
        }
    }
}

module.exports = MessageService
