const { Server } = require('socket.io')
const http = require('http')
const app = require('../app')

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
    },
})

// const userSocketMap = new Map()

io.on('connection', (socket) => {
    console.log("Socket IO connect");

    // const userId = socket.handshake.query.userId

    // if (userId !== 'undefined') userSocketMap.set(userId, socket.id)

    // io.emit('getOnlineUser', Array.from(userSocketMap.keys()))

    socket.on('disconnect', () => {
        console.log('disconnect IO');
    })
})

module.exports = { server, io }
