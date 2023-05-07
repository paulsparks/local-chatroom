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
const Filter = require('bad-words');
var validateColor = require("validate-color").default;
const PORT = process.env.PORT || 3000;
let filter = new Filter();

let userPairs = {

};

let adminIds = [

];

// socketId: style
// Ex - jz1Na2ZLxY37jE0EAAAD: "color: orange; font-weight: bold;"
let stylePairs = [

];

const adminPasswordHash = "5a64bb1397dde9155bf7468ff25f9b95dc4acd8b72d261a6901e89a4c8f6f03f";

const commandList = "/scare [username] /admin [password] /help /color /clearlogs /disconnectsockets"

const badWordList = [
    "bomb",
    "gun",
    "shoot",
    "drug",
    "drugs",
    "b0mb",
    "b0mbs",
    "guns",
    "gunz",
    "bombz",
    "b0mbz",
    "bombs"
];

const defaultServerStyle = "color: red";

filter.addWords(...badWordList);

fs.writeFile('./logs.txt', "", 'utf8', function(error) {
    if (error) throw error
})

const expectedGivenMessageParams = ['message', 'user', 'image'];

function sendMessageSafe(msgObj, socket) {

    let finalMsg = {};

    expectedGivenMessageParams.forEach(param => {
        if (msgObj[param]) {
            finalMsg[param] = msgObj[param];
        }
    });

    if (finalMsg['user']) {
        userPairs[finalMsg.user] = socket.id
    }

    if (finalMsg['message']) {
        try {
            finalMsg.message = filter.clean(finalMsg.message)
        } catch {
            // usually empty catch blocks are bad, however this seems to be an exception
            // if it has issues filtering a message because of weird formatting, chances are that it doesn't need to filter said message anyways
        }
    }

    finalMsg.style = getMessageStyle(socket.id)

    io.emit('message received', finalMsg)

    if (finalMsg['image']) {
        try {
            finalMsg.image = hash(finalMsg.image);
        } catch {
            finalMsg.image = "(image hash error)";
        }
    }

    writeLog(socket.id, JSON.stringify(finalMsg), false)
}

function addToStyle(socketId, styleType, style) {

    if (!stylePairs[socketId]) {
        stylePairs[socketId] = ""
    }

    if (stylePairs[socketId].includes(styleType)) {

        let styleIndex = stylePairs[socketId].indexOf(styleType)
        let endOfStyleIndex = stylePairs[socketId].indexOf(";", styleIndex) + 1
        let styleString = stylePairs[socketId].substring(styleIndex, endOfStyleIndex)

        stylePairs[socketId] = stylePairs[socketId].replace(styleString, `${styleType}:${style};`)

    } else {
        stylePairs[socketId] += `${styleType}:${style};`
    }
}

function getMessageStyle(socketId) {
    if (isAdmin(socketId)) {
        if (!stylePairs[socketId]) {
            return "color: aqua"
        } else {
            return stylePairs[socketId]
        }
    } else {
        return "color: aqua"
    }
}

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

    let finalLogString = `${socketId}: ${logTxt} ${dateString}\n`

    console.log(finalLogString)

    fs.appendFile('./logs.txt', finalLogString, 'utf8', function(error) {
        if (error) throw error
    })
}

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

function isAdmin(socketId) {
    return adminIds.includes(socketId);
}

io.on('connection', (socket) => {

    let userCount = socket.client.conn.server.clientsCount

    console.log(`user ${socket.id} connected`)

    socket.on('message given', (data) => {
        sendMessageSafe(data, socket);
    })

    socket.on('get users', () => {
        io.emit('user count', userCount)
    })

    socket.on('disconnect', () => {

        userCount = socket.client.conn.server.clientsCount

        io.emit('user count', userCount)
        console.log(`user ${socket.id} disconnected`)
    })

    socket.on('scare given', (username) => {
        if (isAdmin(socket.id)) {
            console.log(`scared ${username}`)
            io.to(userPairs[username]).emit('scare received')
        }
    })

    socket.on('color given', (color) => {
        if (isAdmin(socket.id)) {
            if (validateColor(color)) {
                addToStyle(socket.id, "color", color)
                io.to(socket.id).emit('message received', { message: `Color changed to ${color}!`, user: "Server", style: defaultServerStyle })
            } else {
                io.to(socket.id).emit('message received', { message: `Invalid color!`, user: "Server", style: defaultServerStyle })
            }
        }
    })

    socket.on('help', () => {
        if (isAdmin(socket.id)) {
            io.to(socket.id).emit('message received', { message: commandList, user: "Server", style: defaultServerStyle })
        }
    })

    socket.on('disconnect sockets', () => {
        if (isAdmin(socket.id)) {
            io.to(socket.id).emit('message received', { message: 'All sockets disconnected!', user: "Server", style: defaultServerStyle })
            io.disconnectSockets()
        }
    })
    
    socket.on('clear logs', () => {
        if (isAdmin(socket.id)) {
            fs.writeFile('./logs.txt', "", 'utf8', function(error) {
                if (error) throw error
            })
            io.to(socket.id).emit('message received', { message: "Logs cleared!", user: "Server", style: defaultServerStyle })
        }
    })

    socket.on('admin given', (password) => {
        if (!adminIds.includes(socket.id)) {
            if (hash(String(password)) === adminPasswordHash) {
                adminIds.push(socket.id)
                io.to(socket.id).emit('message received', { message: "You are now an admin!", user: "Server", style: defaultServerStyle })
            } else {
                io.to(socket.id).emit('message received', { message: "Incorrect admin password!", user: "Server", style: defaultServerStyle })
            }
        } else {
            io.to(socket.id).emit('message received', { message: "You are already an admin!", user: "Server", style: defaultServerStyle })
        }
    })

})

app.get( "/", (req, res) => {
    res.sendFile(process.cwd() + '/logs.txt');
})

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`)
})
