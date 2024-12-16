const { Server } = require('socket.io')
const http = require('http')
const app = require('../app')

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = socketId => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = userId => users.find(user => user.userId === userId)

io.on('connection', (socket) => {
    socket.on('newUser', (userId) => {
        addUser(userId, socket.id)
        socket.emit('getUsers', users)
    })

    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId)
        user && io.to(user.socketId).emit('getMessage', {
            senderId, text
        })

        user && io.to(user.socketId).emit('check', 1)
    })

    socket.on('disconnect', () => {
        removeUser(socket.id)
        socket.emit('getUsers', users)
    })

    socket.on("send_signal", (data) => {
        socket.join(data.room);
        console.log(`User ${socket.id} joined room ${data.room}`);
        socket.to(data.room).emit("receive_signal", {
            signal: data.signal,
            from: socket.id,
        });
    });

    socket.on("call_user", ({ from, to, roomId }) => {
        const targetSocketId = getUser(to);

        if (targetSocketId) {
            io.to(targetSocketId.socketId).emit("incoming_call", { from, roomId });
        } else {
            io.to(socket.id).emit("call_error", { message: "User not found." });
        }
    });

    socket.on("reject", ({ to }) => {
        if (to) {
            const targetSocketId = users[to];
            if (targetSocketId) {
                io.to(targetSocketId).emit("reject");
            }
        }
    });
})

module.exports = { server, io }
