const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const { Types } = require('mongoose')
const { NotFoundError } = require('../core/error.response')
const { findUserById } = require('../models/repositories/user.repo')
const userModel = require('../models/user.model')
const { getIoRedis } = require('../dbs/init.ioredis')

class UserService {
    static getUser = async (slug) => {
        const user = await userModel.findOne({ slug }).populate('friends', 'name picturePath slug')
        if (!user) {
            throw new NotFoundError('User not found')
        }
        return user
    }

    static getAllUser = async () => {
        return await userModel.find()
    }

    static updateUser = async ({ userId, bodyUpdate }) => {
        return await userModel.findByIdAndUpdate(userId, bodyUpdate, { new: true })
    }

    static approveUser = async ({ id }) => {
        return await userModel.findByIdAndUpdate(id, { status: 'active' })
    }

    static unApproveUser = async ({ id }) => {
        return await userModel.findByIdAndUpdate(id, { status: 'inactive' })
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
            .select('name picturePath slug')

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
            .select('name picturePath slug')

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
            .select('name picturePath slug')

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
            .select('name picturePath slug')

        return listRecipient
    }

    static getAllUserNotFriend = async (userId) => {
        const foundUser = await findUserById(userId)

        const addCommonFriendsCount = async (users) => {
            const result = await Promise.all(users.map(async user => {
                if (foundUser.friends.length) {
                    await getIoRedis().instanceConnect.sadd('currentUser', foundUser.friends)
                }

                if (user.friends && user.friends.length > 0) {
                    await getIoRedis().instanceConnect.sadd(`user_${user._id}_friends`, user.friends);
                }

                const commonFriends = await getIoRedis().instanceConnect.sinter('currentUser', `user_${user._id}_friends`);
                await getIoRedis().instanceConnect.del(`user_${user._id}_friends`);
                await getIoRedis().instanceConnect.del('currentUser');

                delete user.friends
                return {
                    ...user,
                    commonFriendsCount: commonFriends.length
                };
            }))

            return result.sort((a, b) => b.commonFriendsCount - a.commonFriendsCount);
        }

        const users = await userModel
            .find({ _id: { $nin: [...foundUser.requester, ...foundUser.recipient, ...foundUser.friends, userId] } })
            .select({ name: 1, picturePath: 1, slug: 1, friends: 1 })
            .limit(4).lean()

        const usersWithCommonFriends = await addCommonFriendsCount(users);

        return usersWithCommonFriends
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

        return picturePath
    }
}

module.exports = UserService
