const { Server } = require("socket.io")

const io = new Server(1111, {
    cors: true
})

const emailToSocketIdMap = new Map()
const socketIdToEmailMap = new Map()

io.on('connection', (socket) => {
    console.log('Socket', socket.id);
    socket.on('room:join', (data) => {
        const { email, room } = data
        emailToSocketIdMap.set(email, socket.id)
        socketIdToEmailMap.set(socket.id, email)
        io.to(room).emit('user:joined', { email, id: socket.id })
        socket.join(room)
        io.to(socket.id).emit('room:join', data)
    })

    socket.on('user:call', ({ to, offer }) => {
        io.to(to).emit('incomming:call', { from: socket.id, offer })
    })
})