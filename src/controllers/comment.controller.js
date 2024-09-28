const { HttpResponse } = require('../core/response')
const CommentService = require('../services/comment.service')

class CommentController {
    createComment = async (req, res, next) => {
        const response = await CommentService.createComment({ ...req.body, ...req.user })
        new HttpResponse({
            message: 'Create new comment',
            metadata: response,
        }).send(res)
    }

    getCommentByParentId = async (req, res, next) => {
        const response = await CommentService.getCommentByParentId(req.query)
        new HttpResponse({
            message: 'getCommentByParentId',
            metadata: response,
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        const response = await CommentService.deleteComment(req.body)
        new HttpResponse({
            message: 'Delete comment',
            metadata: response,
        }).send(res)
    }
}

module.exports = new CommentController()
