<template>
    <div id="white-background" class="hiddenElement position-fixed top-0 start-0 w-100 h-100 bg-white"><div class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"><img src="../assets/lebanon-warning.png" id="fullscreen-image" class="hiddenElement mx-auto"></div></div>
    <div class="container" id="everything">
        <div class="row">
            <h1 style="margin-top: 10px; color: white; font-size: 12pt; text-align: left;">users: {{ activeUsers }}</h1>
        </div>
        <div class="row">
            <div class="col-12 col-sm-10 offset-0 offset-sm-1 fixed-bottom" id="chatDisplayWrapper">
                <ul id="chatDisplay">
                    <li v-for="(msg, i) in msgs" :key="i"><h2 class="textboxText"><span style="color:aqua;">{{ msg.user }}: </span><span v-if="msg.message != null">{{ msg.message }}</span></h2><span v-if="msg.image != null"><img :src="msg.image" class="imageSent"></span></li>
                </ul>
            </div>
        </div>
        <div class="modal fade" id="warningModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Warning</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    File size is too big! Must not exceed 8 MB!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I understand</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="spamModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Warning</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    You are sending messages too quickly!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I understand</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="tooLongModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Warning</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Your message is too long!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I understand</button>
                </div>
                </div>
            </div>
        </div>
        <div class="row fixed-bottom" id="chatRow">
            <div class="col-12" id="chatBox">
                <div class="container d-flex h-100">
                    <div class="row align-self-center w-100">
                        <div class="col-1 offset-1 offset-sm-0">
                            <input id="fileInput" accept="image/*" type="file" style="display: none;" @change="onFileSelected"><label for="fileInput"><i class="bi bi-card-image" style="font-size: 20pt; color: #b8dfff; cursor: pointer;"></i></label>
                        </div>
                        <div class="col-6 offset-1 offset-sm-0 col-sm-9">
                            <input id="inputBox" @keyup.enter="sendMessage(message); onUpload()" v-model="message" class="form-control">
                            <span v-if="(selectedFile != null) && (selectedFile.size <= 8000000)" class="badge text-bg-primary position-absolute translate-middle" style="margin-top: 15px; text-overflow: ellipsis; max-width: 150px; overflow: hidden; white-space: nowrap;"><span @click="resetImgSelect" class="badge text-bg-danger" style="cursor: pointer;"><i class="bi bi-x"></i></span> {{ selectedFile.name }}</span>  
                        </div>
                        <div class="col-2 d-grid">
                            <button class="btn btn-primary" @:click="sendMessage(message); onUpload()">send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import socketioService from '../../services/socketio.service';
    import { Modal } from 'bootstrap';

    export default {
        name: 'MainPage',
        data() {
            return {
                message: '',
                // msgs is an array of objects passed in from recieved messages
                // this object currently just contains { user: '', message: '' }
                msgs: [],
                activeUsers: 0,
                selectedFile: null,
                warningModal: null,
                spamModal: null,
                tooLongModal: null,
                lastCalledTimestamp: 0,
                callCount: 0
            }
        },
        props: ['username'],
        created() {
            socketioService.setupSocketConnection()

            socketioService.socket.on('message recieved', (dataString) => {
                let data = JSON.parse(dataString)
                this.msgs.push(data)
                this.$nextTick(() => {
                    let bottomOfChat = document.getElementById('chatDisplayWrapper')
                    bottomOfChat.scrollTop = (bottomOfChat.scrollHeight)
                })
            })

            socketioService.socket.emit('get users')

            socketioService.socket.on('user count', (userCount) => {
                this.activeUsers = userCount
            })

            socketioService.socket.on('scare recieved', () => {
                this.getScared()
            })

            socketioService.socket.on('image recieved', (img) => {
                this.msgs.push(img)
                this.$nextTick(() => {
                    let bottomOfChat = document.getElementById('chatDisplayWrapper')
                    bottomOfChat.scrollTop = (bottomOfChat.scrollHeight)
                })
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
                if ((msg != '') && !(this.calledMoreThanOncePerHalfSecond()) && !(this.messageTooLong(msg))) {
                    let [command, arg] = msg.split(' ')
                    if (msg.includes('/scare') && (command === '/scare')) {
                        socketioService.socket.emit('scare given', arg)
                        this.message = ''
                    } else {
                        socketioService.socket.emit('message given', JSON.stringify({ user: this.username, message: msg, image: null }))
                        this.message = ''
                    }
                }
            },
            onFileSelected(event) {
                if(event.target.files[0]){
                    this.selectedFile = (event.target.files[0])
                    if (this.selectedFile.size > 8000000) {
                        this.warningModal.show()
                    }
                }
            },
            onUpload() {
                if (this.selectedFile) {
                    const reader = new FileReader()
                    reader.onload = e => {
                        socketioService.socket.emit('image given', { user: this.username, message: null, image: e.target.result })
                    }
                    reader.readAsDataURL(this.selectedFile)
                    this.selectedFile = null
                    document.getElementById('fileInput').value = ''
                }
            },
            resetImgSelect() {
                this.selectedFile = null
                document.getElementById('fileInput').value = ''
            },
            calledMoreThanOncePerHalfSecond() {
                const now = Date.now();
                
                if (now - this.lastCalledTimestamp >= 500) {
                    this.callCount = 0;
                }

                this.lastCalledTimestamp = now;
                this.callCount++;

                if (this.callCount > 1) {
                    this.spamModal.show();
                }

                return this.callCount > 1;
            },
            messageTooLong(msg) {

                if (msg.length > 1000) {
                    this.tooLongModal.show();
                }

                return (msg.length > 1000);
            },
            getScared() {
                this.toggleVisibility('fullscreen-image');
                this.toggleVisibility('white-background');
                this.toggleVisibility('everything');
            }
        },
        beforeUnmount() {
            socketioService.disconnect()
        },
        mounted() {
            this.warningModal = new Modal(document.getElementById('warningModal'))
            this.spamModal = new Modal(document.getElementById('spamModal'))
            this.tooLongModal = new Modal(document.getElementById('tooLongModal'))
        }
    }
</script>

<style scoped>
    #chatBox {
        background-color: #101a42;
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
    #inputBox {
        background-color: #273366;
        color: white;
        border-color: transparent;
    }
    .hiddenElement {
        display: none;
    }
    .unhiddenElement {
        display: block;
    }
    .imageSent {
        height: 200px;
        max-width: 1200px;
    }
    .textboxText {
        font-size: 18pt;
    }
    .text-bg-primary {
        background-color: #b8dfff !important;
        color: black !important;
    }
    #fullscreen-image {
        height: auto;
        width: 100%;
    }
    @media only screen and (max-width: 576px) {
        #chatDisplayWrapper {
            margin-bottom: 100px;
            height: 80%;
        }
        .imageSent {
            height: 120px;
            max-width: 600px;
        }
        .textboxText {
            font-size: 15pt;
        }
    }
</style>