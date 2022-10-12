<template>
    <div class="container-fluid">
        <div class="row" style="margin-top:400px">
            <div class="col-8 offset-1" style="background-color:white;height:45px;">
                <h1 style="float:left;">{{ messageRecieved }}</h1>
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
                messageRecieved: ''
            }
        },
        created() {
            socket.on('message recieved', (msg) => {
                this.messageRecieved = msg
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
                socket.emit('message given', msg)
            }
        }
    }
</script>

<style scoped>
    #chatBox {
        background-color: #515657;
        height: 100px;
    }
</style>