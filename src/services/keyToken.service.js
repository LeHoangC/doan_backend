const { default: mongoose, Types } = require('mongoose')
const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshToken,
                    refreshTokenUsed: [],
                },
                options = {
                    upsert: true,
                    new: true,
                }

            const keyToken = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return keyToken ? keyToken.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.findByIdAndDelete(id)
    }
}

module.exports = KeyTokenService
