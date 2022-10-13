<template>
    <div class="container">
        <div class="row">
            <h1 style="margin-top: 10px; color: white; font-size: 12pt; text-align: left;">users: {{ activeUsers }}</h1>
        </div>
        <div class="row">
            <div class="col-10 offset-1 fixed-bottom" id="chatDisplayWrapper">
                <ul id="chatDisplay">
                    <li v-for="(msg, i) in msgs" :key="i"><h2 style="font-size: 20pt;"><span style="color:aqua;">{{ msg.user }}: </span>{{ msg.message }}</h2></li>
                </ul>
            </div>
        </div>
        <div class="row fixed-bottom" id="chatRow">
            <div class="col-12" id="chatBox">
                <div class="container d-flex h-100">
                    <div class="row align-self-center w-100">
                        <div class="col-1 d-grid">
                            <i class="bi bi-emoji-smile" style="font-size: 20pt; color: #b8dfff; cursor: pointer;"></i>
                        </div>
                        <div class="col-9">
                            <input @keyup.enter="sendMessage(message)" v-model="message" class="form-control">
                        </div>
                        <div class="col-2 d-grid">
                            <button class="btn btn-primary" @:click="sendMessage(message)">send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { io } from 'socket.io-client'
    let socket = io(process.env.VUE_APP_SOCKET_ENDPOINT)

    export default {
        name: 'MainPage',
        data() {
            return {
                message: '',
                messageRecieved: '',
                // msgs is an array of objects passed in from recieved messages
                // this object currently just contains { user: '', message: '' }
                msgs: [],
                activeUsers: 0
            }
        },
        props: ['username'],
        created() {
            socket.on('message recieved', (dataString) => {
                let data = JSON.parse(dataString)
                this.messageRecieved = data.message
                this.msgs.push(data)
                this.$nextTick(() => {
                    let bottomOfChat = document.getElementById('chatDisplayWrapper')
                    bottomOfChat.scrollTop = (bottomOfChat.scrollHeight)
                })
            })

            socket.emit('get users')

            socket.on('user count', (userCount) => {
                this.activeUsers = userCount
            })
        },
        methods: {
            removeItem(item) {
                let element = document.getElementById(item)
                element.remove()
            },
            toggleVisibility(item) {
                let element = document.getElementById(item)
                if (element.classList.contains('hiddenElement')) {
                    element.classList.remove('hiddenElement')
                    element.classList.add('unhiddenElement')
                } else {
                    element.classList.add('hiddenElement')
                    element.classList.remove('unhiddenElement')
                }
            },
            sendMessage(msg) {
                msg = msg.trim()
                if (msg != '') {
                    socket.emit('message given', JSON.stringify({ user: this.username, message: msg }))
                    this.message = ''
                }
            }
        }
    }
</script>

<style scoped>
    #chatBox {
        background-color: #2c3e5c;
        height: 100px;
    }
    #chatDisplay {
        color: white;
        list-style: none;
        min-width: 100%;
        text-align: left;
        overflow-wrap: break-word;
        padding-left: 0;
    }
    #chatDisplayWrapper {
        background-color: #0c1426;
        margin-bottom: 200px;
        height: 60%;
        overflow-y: auto;
    }
</style>