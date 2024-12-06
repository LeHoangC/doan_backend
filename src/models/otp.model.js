const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'Otp'
const COLLECTION_NAME = 'otps'

const otpSchema = new Schema(
    {
        email: String,
        otp: String,
        time: {
            type: Date, default: Date.now, index: { expires: 60 }
        }
    },
    {
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, otpSchema)
