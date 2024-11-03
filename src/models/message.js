const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'Message'
const COLLECTION_NAME = 'messages'

const conversationSchema = new Schema(
    {
        conversationId: {
            type: Types.ObjectId,
            ref: 'Conversation',
        },
        sender: {
            type: Types.ObjectId,
            ref: 'User',
        },
        text: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, conversationSchema)
