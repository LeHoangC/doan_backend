const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Post'
const COLLECTION_NAME = 'posts'

const postSchema = new Schema(
    {
        post_userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        post_content: {
            type: String,
        },

        post_likes: {
            type: Map,
            of: Boolean,
            default: {},
        },

        post_commentCount: {
            type: Number,
            default: 0,
        },

        post_likeCount: {
            type: Number,
            default: 0,
        },

        post_type: {
            type: String,
            required: true,
            enum: ['public', 'private'],
            default: 'public',
        },

        post_location: String,
        post_picturePath: String,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

postSchema.index({ post_content: 'text' })

module.exports = model(DOCUMENT_NAME, postSchema)
