const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'Conversation'
const COLLECTION_NAME = 'conversations'

const conversationSchema = new Schema(
    {
        members: [{ type: Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, conversationSchema)
