const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Story'
const COLLECTION_NAME = 'stories'

const storySchema = new Schema(
    {
        story_userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, storySchema)
