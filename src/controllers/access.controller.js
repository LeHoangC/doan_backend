const { HttpResponse } = require('../core/response')
const { SuccessResponse, CREATED } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        const response = await AccessService.handleRefreshToken({
            user: req.user,
            keyStore: req.keyStore,
            refreshToken: req.refreshToken,
        })

        new HttpResponse({
            message: response.message,
            metadata: response.data,
        }).send(res)
    }

    logout = async (req, res, next) => {
        const response = await AccessService.logout(req.keyStore)
        new HttpResponse({
            message: response.message,
        }).send(res)
    }

    login = async (req, res, next) => {
        const response = await AccessService.login(req.body)

        res.cookie('token', response.data.tokens.accessToken, {
            httpOnly: true,
            maxAge: 60 * 15 * 1000,
            secure: false,
        })

        new HttpResponse({
            message: response.message,
            metadata: response.data,
            statusCode: response.status,
        }).send(res)
    }

    signUp = async (req, res, next) => {
        const response = await AccessService.signUp(req.body)

        new HttpResponse({
            message: response.message,
            metadata: response.data,
            statusCode: response.status,
        }).send(res)
    }
}

module.exports = new AccessController()
