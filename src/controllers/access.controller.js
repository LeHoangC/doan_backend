const { SuccessResponse, CREATED } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        const response = await AccessService.handleRefreshToken({
            user: req.user,
            keyStore: req.keyStore,
            refreshToken: req.refreshToken,
        })

        new SuccessResponse({
            metadata: response
        }).send(res)
    }

    logout = async (req, res, next) => {
        const response = await AccessService.logout(req.keyStore)
        new SuccessResponse({
            metadata: response
        }).send(res)
    }

    login = async (req, res, next) => {
        const response = await AccessService.login(req.body)

        // res.cookie('token', response.tokens.accessToken, {
        //     httpOnly: true,
        //     maxAge: 60 * 15 * 1000,
        //     secure: false,
        // })

        // res.cookie('rf_token', response.tokens.refreshToken, {
        //     httpOnly: true,
        //     maxAge: 60 * 15 * 1000,
        //     secure: false,
        // })

        new SuccessResponse({
            metadata: response
        }).send(res)
    }

    signUp = async (req, res, next) => {
        const response = await AccessService.signUp(req.body)

        new CREATED({
            metadata: response
        }).send(res)
    }
}

module.exports = new AccessController()
