const crypto = require('node:crypto')
const bcrypt = require('bcrypt')
const USER_MODEL = require('../models/user.model')
const {
    BadRequestError,
    NotFoundError,
    AuthFailureError,
    ForbiddenError,
    ConflictRequestError,
} = require('../core/error.response')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const KeyTokenService = require('./keyToken.service')
const keytokenModel = require('../models/keytoken.model')

class AccessService {
    static handleRefreshToken = async ({ user, keyStore, refreshToken }) => {
        const { userId, email } = user

        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! Pls relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('User not register')

        const foundUser = await USER_MODEL.findOne({ email })

        if (!foundUser) throw new AuthFailureError('User not register')

        const tokens = await createTokenPair({ userId: foundUser._id, email }, keyStore.publicKey, keyStore.privateKey)

        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            privateKey: keyStore.privateKey,
            publicKey: keyStore.publicKey,
            refreshToken: tokens.refreshToken,
        })

        await keytokenModel.updateOne(
            { _id: keyStore._id },
            {
                $set: {
                    refreshToken: tokens.refreshToken,
                },
                $addToSet: {
                    refreshTokenUsed: refreshToken,
                },
            }
        )

        return {
            user,
            tokens,
        }
    }

    static signUp = async ({ name, email, password }) => {
        const holderUser = await USER_MODEL.findOne({ email }).lean()

        if (holderUser) {
            throw new ConflictRequestError('Email đã được đăng ký')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await USER_MODEL.create({
            name,
            email,
            password: passwordHash,
        })

        if (newUser) {
            // tạo token
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')
            const tokens = await createTokenPair({ userId: newUser._id, email }, publicKey, privateKey)

            // tạo key cho user
            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken,
            })

            if (!publicKeyString) {
                throw new BadRequestError('Create keytoken error')
            }

            return {
                user: getInfoData(['_id', 'name', 'email'], newUser),
                tokens,
            }
        }
    }

    static login = async ({ email, password }) => {
        const foundUser = await USER_MODEL.findOne({ email })

        if (!foundUser) {
            throw new NotFoundError('User not registered')
        }

        const match = await bcrypt.compare(password, foundUser.password)
        if (!match) {
            throw new AuthFailureError('Thông tin tài khoản hoặc mật khẩu không chính xác')
        }

        // tạo token
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        const tokens = await createTokenPair({ userId: foundUser._id, email }, publicKey, privateKey)

        // tạo hoặc cập nhật keytoken cho user
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
        })

        return {
            user: getInfoData(['_id', 'name', 'email', 'picturePath'], foundUser),
            tokens,
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return {
            message: 'Logout success',
        }
    }
}

module.exports = AccessService
