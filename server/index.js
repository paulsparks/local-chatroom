const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origins: [process.env.WEBSERVER_URL]
    },
    maxHttpBufferSize: 8e6 // 8 MB
})
const { createHash } = require('crypto');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

function writeLog(socketId, dataString, isImage) {
    let currentDate = new Date()
    let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds()
    let dateString = currentDate.toLocaleDateString() + ' ' + currentTime
    let logTxt

    if (isImage) {
        logTxt = `(image): ${dataString}`
    } else {
        logTxt = dataString
    }

    fs.appendFile('./logs.txt', `${socketId}: ${logTxt} ${dateString}\n`, 'utf8', function(error) {
        if (error) throw error
    })
}

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

io.on('connection', (socket) => {

    let userCount = socket.client.conn.server.clientsCount

    console.log(`user ${socket.id} connected`)

    socket.on('message given', (dataString) => {
        let data = JSON.parse(dataString)
        console.log(`${socket.id}: ${dataString}`)
        io.emit('message recieved', JSON.stringify({ message: data.message, user: data.user }))

        writeLog(socket.id, dataString, false)
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
        let imgName = hash(imgObj.image)
        console.log(`${socket.id}: (image): ${imgName}`)
        io.emit('image recieved', imgObj)

        writeLog(socket.id, imgName, true)
    })

})

app.get( "/", (req, res) => {
    res.sendFile(process.cwd() + '/logs.txt');
})

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`)
})
