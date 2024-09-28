const { HttpResponse } = require('../core/response')
const UserService = require('../services/user.service')

class UserController {
    static getUser = async (req, res, next) => {
        const response = await UserService.getUser(req.params.userId)
        new HttpResponse({ metadata: response }).send(res)
    }

    static getFriends = async (req, res, next) => {
        const response = await UserService.getFriends(req.params.userId)
        new HttpResponse({ metadata: response }).send(res)
    }

    static getFollowing = async (req, res, next) => {
        const response = await UserService.getFollowing(req.params.userId)
        new HttpResponse({ metadata: response }).send(res)
    }

    static getRequester = async (req, res, next) => {
        const response = await UserService.getRequester(req.params.userId)
        new HttpResponse({ metadata: response }).send(res)
    }

    static getRecipient = async (req, res, next) => {
        const response = await UserService.getRecipient(req.params.userId)
        new HttpResponse({ metadata: response }).send(res)
    }

    static getAllUserNotFriend = async (req, res, next) => {
        const response = await UserService.getAllUserNotFriend(req.params.userId)
        new HttpResponse({ metadata: response }).send(res)
    }

    static addFriend = async (req, res, next) => {
        const response = await UserService.addFriend({ userId: req.user.userId, receiverId: req.body.receiverId })
        new HttpResponse({ metadata: response.data, message: response.message }).send(res)
    }

    static acceptFriend = async (req, res, next) => {
        const response = await UserService.acceptFriend({ userId: req.user.userId, friendId: req.body.friendId })
        new HttpResponse({ metadata: response }).send(res)
    }

    static removeFriend = async (req, res, next) => {
        const response = await UserService.removeFriend({ userId: req.user.userId, friendId: req.body.friendId })
        new HttpResponse({ metadata: response }).send(res)
    }

    static uploadAvatar = async (req, res, next) => {
        const response = await UserService.uploadAvatar({ userId: req.user.userId, picturePath: req.file.filename })
        new HttpResponse({ metadata: response }).send(res)
    }
}

module.exports = UserController
