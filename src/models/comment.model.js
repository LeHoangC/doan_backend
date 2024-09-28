const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'comments'

var commentSchema = new Schema(
    {
        comment_postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
        comment_userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        comment_content: {
            type: String,
            default: '',
        },
        comment_left: {
            type: Number,
            default: 0,
        },
        comment_right: {
            type: Number,
            default: 0,
        },
        comment_parentId: {
            type: Schema.Types.ObjectId,
            ref: DOCUMENT_NAME,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema)
