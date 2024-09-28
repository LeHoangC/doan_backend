const { ReasonPhrases, StatusCodes } = require('http-status-codes')

class SuccessResponse {
    constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, data = {} }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.data = data
    }
}

class OK extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, data })
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, data }) {
        super({ message, statusCode, reasonStatusCode, data })
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessResponse,
}
