const conversationModel = require('../models/conversation')

class ConversationService {
    static getConversation = async ({ senderId, receiverId }) => {
        let conversation = await conversationModel.findOne({
            members: { $all: [senderId, receiverId] },
        })

        if (!conversation) {
            conversation = new conversationModel({
                members: [senderId, receiverId],
            })
            await conversation.save()
        }

        return ({
            message: 'Comversation',
            data: conversation,
        })
    }

    static getConversations = async ({ userId }) => {
        return ({
            message: 'Get Conversations',
            data: await conversationModel.find({
                members: {
                    $in: [userId],
                },
            }),
        })
    }
}

module.exports = ConversationService
