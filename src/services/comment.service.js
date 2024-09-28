/*
    - add comment
    - get list comment
    - delete comment
*/

const { NotFoundError } = require('../core/error.response')
const commentModel = require('../models/comment.model')
const postModel = require('../models/post.model')
const { convertToObjectIdMongodb } = require('../utils/index')

class CommentService {
    static createComment = async ({ postId, userId, content, parentCommentId = null }) => {
        const foundPost = await postModel.findById(postId)

        if (!foundPost) throw new NotFoundError('Post not found!')

        const comment = new commentModel({
            comment_postId: postId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId,
        })

        let rightValue

        if (parentCommentId) {
            // comment reply

            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Comment not found!')

            rightValue = parentComment.comment_right

            await commentModel.updateMany(
                {
                    comment_postId: convertToObjectIdMongodb(postId),
                    comment_right: { $gte: rightValue },
                },
                {
                    $inc: {
                        comment_right: 2,
                    },
                }
            )

            await commentModel.updateMany(
                {
                    comment_postId: convertToObjectIdMongodb(postId),
                    comment_left: { $gt: rightValue },
                },
                {
                    $inc: {
                        comment_left: 2,
                    },
                }
            )
        } else {
            const maxRightValue = await commentModel.findOne(
                {
                    comment_postId: convertToObjectIdMongodb(postId),
                },
                'comment_right',
                { sort: { comment_right: -1 } }
            )

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        foundPost.post_commentCount = foundPost.post_commentCount + 1
        await foundPost.save()

        return comment
    }

    static getCommentByParentId = async ({ postId, parentCommentId, limit = 20, page = 1 }) => {
        var skip = (page - 1) * limit

        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError('Comment not found!')

            const comments = await commentModel
                .find({
                    comment_postId: convertToObjectIdMongodb(postId),
                    comment_left: { $gt: parent.comment_left },
                    comment_right: { $lte: parent.comment_right },
                })
                .populate({ path: 'comment_userId', select: 'name picturePath' })
                .select({ comment_content: 1, comment_parentId: 1, createdAt: 1, comment_postId: 1 })
                .skip(skip)
                .limit(limit)
                .sort({ comment_left: -1 })
                .lean()

            return comments
        }

        const comments = await commentModel
            .find({
                comment_postId: convertToObjectIdMongodb(postId),
                comment_parentId: null,
            })
            .populate({ path: 'comment_userId', select: 'name picturePath' })
            .select({ comment_content: 1, comment_parentId: 1, createdAt: 1, comment_postId: 1 })
            .skip(skip)
            .limit(limit)
            .sort({ comment_left: -1 })
            .lean()

        return comments
    }

    static deleteComment = async ({ postId, commentId }) => {
        const foundPost = await postModel.findById(postId)
        if (!foundPost) throw new NotFoundError('Post not found!')

        const comment = await commentModel.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found!')

        // tinh width
        const width = comment.comment_right - comment.comment_left + 1

        // xoa cac comment con
        await commentModel.deleteMany({
            comment_postId: convertToObjectIdMongodb(postId),
            comment_left: { $gte: comment.comment_left, $lte: comment.comment_right },
        })

        // cap nhat left va right cac comment con lai
        await commentModel.updateMany(
            {
                comment_postId: convertToObjectIdMongodb(postId),
                comment_left: { $gt: comment.comment_right },
            },
            {
                $inc: { comment_left: -width },
            }
        )

        await commentModel.updateMany(
            {
                comment_postId: convertToObjectIdMongodb(postId),
                comment_right: { $gt: comment.comment_right },
            },
            {
                $inc: { comment_right: -width },
            }
        )
        foundPost.post_commentCount = foundPost.post_commentCount - width / 2
        await foundPost.save()
    }
}

module.exports = CommentService
