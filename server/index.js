const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080']
    }
})
const fs = require('fs')

io.on('connection', (socket) => {

    let userCount

    // this is a horrible solution to an underlying problem
    // where one user connects two sockets! fix later!
    if (socket.client.conn.server.clientsCount > 1) {
        userCount = socket.client.conn.server.clientsCount / 2
    } else {
        userCount = socket.client.conn.server.clientsCount
    }

    // console.log(`user ${socket.id} connected`)

    socket.on('message given', (dataString) => {
        let data = JSON.parse(dataString)
        console.log(`${socket.id}: ${dataString}`)
        io.emit('message recieved', JSON.stringify({ message: data.message, user: data.user }))

        // log the file
        let currentDate = new Date()//.toLocaleDateString()
        let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        let dateString = currentDate.toLocaleDateString() + ' ' + currentTime
        fs.appendFile('./logs.txt', `${socket.id}: ${dataString} ${dateString}\n`, 'utf8', function(error) {
            if (error) throw error
        })
    })

    socket.on('get users', () => {
        io.emit('user count', userCount)
    })

    socket.on('disconnect', () => {

        // this is a horrible solution to an underlying problem
        // where one user connects two sockets! fix later!
        if (socket.client.conn.server.clientsCount > 1) {
            userCount = socket.client.conn.server.clientsCount / 2
        } else {
            userCount = socket.client.conn.server.clientsCount
        }

        io.emit('user count', userCount)
    })

})

http.listen(3000, () => {
    console.log('listening on *:3000')
})