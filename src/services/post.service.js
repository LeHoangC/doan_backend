const { BadRequestError, NotFoundError, ForbiddenError } = require('../core/error.response')
const { CREATED } = require('../core/success.response')
const postModel = require('../models/post.model')
const commentModel = require('../models/comment.model')
const { searchPostByUser } = require('../models/repositories/post.repo')
const { findUserById } = require('../models/repositories/user.repo')
const { convertToObjectIdMongodb } = require('../utils')
const uploadMediaService = require('./upload.service')

class PostService {
    static createPost = async ({ userId, content, type, location, file }) => {
        let urlImage
        if (file) {
            urlImage = await uploadMediaService.uploadImageFromLocal({ path: file.path, folderName: `post/${userId}` })
        }

        const newPost = await postModel.create({
            post_userId: convertToObjectIdMongodb(userId),
            post_content: content,
            post_type: type,
            post_location: location,
            post_picturePath: urlImage,
        })

        if (!newPost) {
            throw new BadRequestError('Create post error')
        }

        return {
            message: 'Create post success',
            data: newPost,
        }
    }

    static getUserPosts = async ({ currentId, userId }) => {
        const filter = { post_userId: userId }

        if (currentId !== userId) {
            filter['post_type'] = 'public'
        }

        const posts = await postModel.find(filter).populate({ path: 'post_userId', select: 'name picturePath' })
        return posts
    }

    static getFollowingAndFriendPosts = async ({ userId, limit = 20, skip = 0 }) => {
        const user = await findUserById(userId)
        const listIdFollowing = [...user.following, user.recipient, ...user.friends, userId]

        const posts = await postModel
            .find({
                post_userId: {
                    $in: listIdFollowing,
                },
                post_type: 'public'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('post_userId', 'name picturePath')

        return posts
    }

    static likePost = async ({ userId, postId }) => {
        const post = await postModel.findById(postId)
        if (!post) {
            throw new NotFoundError('Post not found!')
        }
        const userIsLike = post.post_likes.get(userId)
        if (userIsLike) {
            post.post_likes.delete(userId)
            --post.post_likeCount
        } else {
            post.post_likes.set(userId, true)
            ++post.post_likeCount
        }
        await post.save()
        return post
    }

    static deletePost = async ({ userId, postId }) => {
        const deleted = await postModel.deleteOne({
            post_userId: userId,
            _id: convertToObjectIdMongodb(postId),
        })

        await commentModel.deleteMany({ comment_postId: postId })

        if (deleted.acknowledged && deleted.deletedCount === 1) {
            return deleted
        }

        throw new ForbiddenError('Forbidden')
    }

    static searchPost = async ({ keySearch }) => {
        return await searchPostByUser({ keySearch })
    }
}

module.exports = PostService
