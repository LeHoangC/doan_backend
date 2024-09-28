const { getIoRedis } = require('../dbs/init.ioredis')
const { instanceConnect: redisClient } = getIoRedis()

class RedisService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        const TTL = 7 * 24 * 60 * 60
        const publicKeyString = await redisClient.hmset(`key_user:${userId}`, {
            publicKey,
            privateKey,
            refreshToken,
        })

        await redisClient.expire(`key_user:${userId}`, TTL)
        return publicKeyString
    }

    static findKeyStore = async (userId) => {
        const findKey = await redisClient.exists(`key_user:${userId}`)

        if (!findKey) {
            return findKey
        }

        return await redisClient.hgetall(`key_user:${userId}`)
    }

    static delKeyStore = async (userId) => {
        return await redisClient.del(`key_user:${userId}`)
    }
}

module.exports = RedisService
