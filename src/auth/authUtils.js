const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandle')
const { findByUserId } = require('../services/keyToken.service')
const { NotFoundError, AuthFailureError } = require('../core/error.response')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '1h',
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '15days',
        })
        return {
            accessToken,
            refreshToken,
        }
    } catch (error) { }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]



    if (!userId) {
        throw new AuthFailureError('Invalid Request')
    }

    const keyStore = await findByUserId(userId)

    if (!keyStore) {
        throw new NotFoundError('Not Found KeyStore')
    }

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]

            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

            if (userId !== decodeUser.userId) {
                throw new AuthFailureError('Invalid Request')
            }

            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken

            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError('Invalid Request')
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid Request')
        }
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw new AuthFailureError(error.name)
    }
})

module.exports = {
    createTokenPair,
    authentication,
}
