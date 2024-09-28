const Redis = require('ioredis')
const { RedisErrorResponce } = require('../core/error.response')

let client = {},
    statusConnectRedis = {
        CONNECT: 'connect',
        END: 'end',
        RECONNECT: 'reconnecting',
        ERROR: 'error',
    },
    connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10 * 1000,
    REDIS_CONNECT_MESSAGE = {
        code: -6379,
        message: {
            vn: 'Redis lỗi rồi hotfix, hotfix!!!',
        },
    }

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponce(REDIS_CONNECT_MESSAGE.message.vn, REDIS_CONNECT_MESSAGE.code)
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`ConnectionIoRedis - Connection Status: Connected`)
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`ConnectionIoRedis - Connection Status: End`)
        handleTimeoutError()
    })
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`ConnectionIoRedis - Connection Status: reconnecting`)
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`ConnectionIoRedis - Connection Status: Error:::${err}`)
        handleTimeoutError()
    })
}

const init = async ({ REDIS_HOST = process.env.REDIS_HOST, REDIS_PORT = 6379, REDIS_USERNAME, REDIS_PASSWORD }) => {
    // const urlConnectRedis = `rediss://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
    const urlConnectRedis = `${REDIS_HOST}:${REDIS_PORT}`

    // const instanceRedis = new Redis(urlConnectRedis)
    const instanceRedis = new Redis(urlConnectRedis)
    client.instanceConnect = instanceRedis
    handleEventConnection({ connectionRedis: instanceRedis })
}

const getIoRedis = () => client

const closeIoRedis = () => {
    client.instanceConnect.close()
}

module.exports = {
    init,
    getIoRedis,
    closeIoRedis,
}
