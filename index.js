const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080']
    }
})

app.get('/', (req, res) => {
    res.send('<h1>Hey socket.io</h1>')
})

io.on('connection', (socket) => {

    console.log('a user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('my message', (msg) => {
        console.log("Client: " + msg)
        io.emit('my broadcast', `server: ${msg}`)
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})