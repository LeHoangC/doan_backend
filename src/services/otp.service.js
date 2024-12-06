const OTP_MODEL = require('../models/otp.model')
const bcrypt = require('bcrypt')

class OtpService {
    static insertOtp = async ({ email, otp }) => {
        const hashOtp = await bcrypt.hash(otp, 10)
        const newOtp = await OTP_MODEL.create({
            email,
            otp: hashOtp
        })

        return newOtp ? 1 : 0
    }

    static validOtp = async ({ otp, hashOtp }) => {
        const isValid = await bcrypt.compare(otp, hashOtp)
        return isValid
    }
}

module.exports = OtpService