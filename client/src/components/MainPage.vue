<template>
    <div class="container">
        <div class="row">
            <div class="col-10" id="chatDisplayWrapper">
                <ul id="chatDisplay">
                    <li v-for="(msg, i) in msgs" :key="i"><h2>{{ msg }}</h2></li>
                </ul>
            </div>
        </div>
        <div class="row fixed-bottom" id="chatRow">
            <div class="col-12" id="chatBox">
                <div class="container d-flex h-100">
                    <div class="row align-self-center w-100">
                        <div class="col-12">
                            <input v-model="message" type="email" class="form-control" id="exampleFormControlInput1">
                            <button @:click="sendMessage(message)">send</button>
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
                msgs: []
            }
        },
        props: ['username'],
        created() {
            socket.on('message recieved', (msg) => {
                this.messageRecieved = msg
                this.msgs.push(msg)
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
                socket.emit('message given', `${this.username}: ${msg}`)
            }
        }
    }
</script>

<style scoped>
    #chatBox {
        background-color: #515657;
        height: 100px;
    }
    #chatDisplay {
        color: white;
        list-style: none;
        float: left;
    }
    #chatDisplayWrapper {
        background-color: black;
    }
</style>