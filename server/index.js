const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080']
    }
})

io.on('connection', (socket) => {

    // console.log(`user ${socket.id} connected`)

    // socket.on('disconnect', () => {
    //     console.log(`user ${socket.id} disconnected`)
    // })

    socket.on('message given', (msg) => {
        console.log(`user ${socket.id} says "${msg}"`)
        io.emit('message recieved', msg)
    })

})

http.listen(3000, () => {
    console.log('listening on *:3000')
})