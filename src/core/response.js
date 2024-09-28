const { ReasonPhrases, StatusCodes } = require('http-status-codes')

class HttpResponse {
    constructor({
        message = ReasonPhrases.OK,
        statusCode = StatusCodes.OK,
        reasonStatusCode = ReasonPhrases.OK,
        metadata = {},
    }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

module.exports = {
    HttpResponse,
}
