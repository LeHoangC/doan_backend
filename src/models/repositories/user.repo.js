const userModel = require('../user.model')

const findUserByEmail = async ({ email }) => {
    return await userModel.findOne({ email }).lean()
}

const findUserById = async (userId) => {
    return await userModel.findById(userId).select('-__v -password').lean()
}

module.exports = {
    findUserByEmail,
    findUserById,
}
