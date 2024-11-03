// const app = require('./src/app')

const { server } = require('./src/socket')

const PORT = process.env.PORT || 3000

const app = server.listen(PORT, () => {
    console.log('Backend đồ án start port', PORT)
})

// process.on('SIGINT', () => {
//     server.close(() => {
//         console.log('Server exit')
//     })
// })
