const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = (fields, object) => {
    return _.pick(object, fields)
}

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id)

module.exports = {
    getInfoData,
    convertToObjectIdMongodb,
}
