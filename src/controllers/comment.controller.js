const { SuccessResponse } = require('../core/success.response')
const CommentService = require('../services/comment.service')

class CommentController {
    createComment = async (req, res, next) => {
        const response = await CommentService.createComment({ ...req.body, ...req.user })
        new SuccessResponse({
            metadata: response,
        }).send(res)
    }

    getCommentByParentId = async (req, res, next) => {
        const response = await CommentService.getCommentByParentId(req.query)
        new SuccessResponse({
            message: 'getCommentByParentId',
            metadata: response,
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        const response = await CommentService.deleteComment(req.body)
        new SuccessResponse({
            message: 'Delete comment',
            metadata: response,
        }).send(res)
    }
}

module.exports = new CommentController()
