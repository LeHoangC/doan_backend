const { SuccessResponse, CREATED } = require('../core/success.response')
const PostService = require('../services/post.service')

class PostController {
    static genCaptionWithAi = async (req, res, next) => {
        const { prompt = 'Hello', imageUrl } = req.query;

        const streamResult = await PostService.genCaptionWithAi({ prompt, imageUrl });
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        for await (const chunk of streamResult.stream) {
            const chunkText = await chunk.text();
            console.log(chunkText);

            res.write(chunkText);
        }
        res.end();
    }

    static createPost = async (req, res, next) => {
        const { file } = req
        const response = await PostService.createPost({ userId: req.user.userId, ...req.body, file })
        new CREATED({
            message: response.message,
            metadata: response.data,
        }).send(res)
    }

    static getUserPosts = async (req, res, next) => {
        const response = await PostService.getUserPosts({ currentId: req.user.userId, userSlug: req.params.userSlug })
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

    static getAllPosts = async (req, res, next) => {
        const response = await PostService.getAllPost()
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
