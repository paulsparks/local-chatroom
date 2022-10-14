const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080']
    },
    maxHttpBufferSize: 8e6 // 8 MB
})
const fs = require('fs')

io.on('connection', (socket) => {

    let userCount = socket.client.conn.server.clientsCount
    let clientIp = socket.request.connection.remoteAddress

    console.log(`user ${socket.id} connected`)

    socket.on('message given', (dataString) => {
        let data = JSON.parse(dataString)
        console.log(`${socket.id}: ${dataString}`)
        io.emit('message recieved', JSON.stringify({ message: data.message, user: data.user }))

        // log the file
        let currentDate = new Date()//.toLocaleDateString()
        let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        let dateString = currentDate.toLocaleDateString() + ' ' + currentTime
        fs.appendFile('./logs.txt', `${socket.id}: ${dataString} ${dateString} ${clientIp}\n`, 'utf8', function(error) {
            if (error) throw error
        })
    })

    socket.on('get users', () => {
        io.emit('user count', userCount)
    })

    socket.on('disconnect', () => {

        userCount = socket.client.conn.server.clientsCount

        io.emit('user count', userCount)
        console.log(`user ${socket.id} disconnected`)
    })

    socket.on('image given', (imgObj) => {
        io.emit('image recieved', imgObj)
    })

})

http.listen(3000, () => {
    console.log('listening on *:3000')
})