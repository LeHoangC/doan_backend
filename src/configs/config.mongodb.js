const development = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        host: process.env.DEV_DB_HOST || 'mongo',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'dbDevDoan',
    },
}

const production = {
    app: {
        port: process.env.PRO_APP_PORT || 3000,
    },
    db: {
        host: process.env.PRO_DB_HOST || 'mongo',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'dbProduct',
    },
}

const config = { development, production }

const env = process.env.NODE_ENV || 'development'

module.exports = config[env]
