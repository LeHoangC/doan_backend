const { SuccessResponse } = require('../core/success.response')
const PostService = require('../services/post.service')

class PostController {
    static createPost = async (req, res, next) => {
        const { file } = req
        const response = await PostService.createPost({ userId: req.user.userId, ...req.body, file })
        new SuccessResponse({
            message: response.message,
            metadata: response.data,
        }).send(res)
    }

    static getUserPosts = async (req, res, next) => {
        const response = await PostService.getUserPosts({ currentId: req.user.userId, userId: req.params.userId })
        new SuccessResponse({
            metadata: response,
        }).send(res)
    }

    static getFollowingAndFriendPosts = async (req, res, next) => {
        const { limit, page } = req.query
        const skip = (page - 1) * limit
        const response = await PostService.getFollowingAndFriendPosts({ userId: req.user.userId, skip, limit })

        new SuccessResponse({
            metadata: response,
        }).send(res)
    }

    static likePost = async (req, res, next) => {
        const response = await PostService.likePost({ userId: req.user.userId, postId: req.params.id })
        new SuccessResponse({
            metadata: response,
        }).send(res)
    }

    static searchPost = async (req, res, next) => {
        const response = await PostService.searchPost(req.params)
        new SuccessResponse({
            metadata: response,
        }).send(res)
    }

    static deletePost = async (req, res, next) => {
        const response = await PostService.deletePost({ userId: req.user.userId, postId: req.params.id })
        new SuccessResponse({
            metadata: response,
        }).send(res)
    }
}

module.exports = PostController
