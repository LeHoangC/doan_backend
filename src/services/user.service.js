const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const { Types } = require('mongoose')
const { NotFoundError } = require('../core/error.response')
const { findUserById } = require('../models/repositories/user.repo')
const userModel = require('../models/user.model')

class UserService {
    static getUser = async (slug) => {
        const user = await userModel.findOne({ slug }).populate('friends', 'name picturePath slug')
        if (!user) {
            throw new NotFoundError('User not found')
        }
        return user
    }

    static updateUser = async ({ userId, bodyUpdate }) => {
        console.log(userId);

        console.log(bodyUpdate);

        return await userModel.findByIdAndUpdate(userId, bodyUpdate, { new: true })
    }

    static getFriends = async (userId) => {
        const user = await findUserById(userId)
        const listFriends = await userModel
            .find({
                _id: {
                    $in: user.friends,
                },
            })
            .populate('friends', 'name picturePath')
            .select('name picturePath')

        return listFriends
    }

    static getFollowing = async (userId) => {
        const user = await findUserById(userId)
        const listFollowing = await userModel
            .find({
                _id: {
                    $in: user.following,
                },
                status: 'active',
            })
            .select('name picturePath')

        return listFollowing
    }

    static getRequester = async (userId) => {
        const user = await findUserById(userId)
        const listRequester = await userModel
            .find({
                _id: {
                    $in: user.requester,
                },
            })
            .select('name picturePath')

        return listRequester
    }

    static getRecipient = async (userId) => {
        const user = await findUserById(userId)
        const listRecipient = await userModel
            .find({
                _id: {
                    $in: user.recipient,
                },
            })
            .select('name picturePath')

        return listRecipient
    }

    static getAllUserNotFriend = async (userId) => {
        const user = await findUserById(userId)

        const users = await userModel
            .find({ _id: { $nin: [...user.requester, ...user.recipient, ...user.friends, userId] } })
            .select({ name: 1, picturePath: 1, slug: 1 })
            .limit(4)
        return users
    }

    static addFriend = async ({ userId, receiverId }) => {

        const foundFriend = await findUserById(receiverId)

        if (!foundFriend) throw new NotFoundError('User not found')

        const response = await userModel.bulkWrite([
            {
                updateOne: {
                    filter: { _id: userId },
                    update: { $addToSet: { recipient: receiverId } },
                },
            },
            {
                updateOne: {
                    filter: { _id: receiverId },
                    update: { $addToSet: { requester: userId } },
                },
            },
        ])

        return {
            message: 'Gửi yêu cầu thành công',
            data: response,
        }
    }

    static acceptFriend = async ({ userId, friendId }) => {
        const foundFriend = await findUserById(friendId)
        if (!foundFriend) throw new NotFoundError('User not found')

        await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $addToSet: {
                    friends: new Types.ObjectId(friendId),
                },
                $pull: {
                    requester: new Types.ObjectId(friendId),
                },
            }
        )

        await userModel.updateOne(
            {
                _id: friendId,
            },
            {
                $addToSet: {
                    friends: new Types.ObjectId(userId),
                },
                $pull: {
                    recipient: new Types.ObjectId(userId),
                },
            }
        )
        return {
            mesage: 'oke',
        }
    }

    static removeFriend = async ({ userId, friendId }) => {
        const user = await findUserById(userId)
        const foundFriend = await findUserById(friendId)

        const isFriend = user.friends.some((id) => id.equals(new Types.ObjectId(friendId)))
        if (!isFriend) {
            throw new NotFoundError('Friend not found')
        }

        const response = await userModel.bulkWrite([
            {
                updateOne: {
                    filter: { _id: user._id },
                    update: { $pull: { friends: friendId } },
                },
            },
            {
                updateOne: {
                    filter: { _id: foundFriend._id },
                    update: { $pull: { friends: userId } },
                },
            },
        ])

        return 1
    }

    static uploadAvatar = async ({ userId, picturePath }) => {
        const foundUser = await findUserById(userId)

        if (foundUser.picturePath) {
            await unlinkAsync(`public/assets/${foundUser.picturePath}`)
        }

        const uploadAvatar = await userModel.updateOne(
            {
                _id: userId,
            },
            {
                picturePath,
            }
        )

        return uploadAvatar
    }
}

module.exports = UserService
