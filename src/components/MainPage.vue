<template>
    <div class="container-fluid">
        <div class="row" style="margin-top:400px">
            <div class="col-8 offset-1" style="background-color:white;height:45px;">
                <h1 style="float:left;">Replace this text with input</h1>
            </div>
        </div>
        <div class="row fixed-bottom" id="chatRow">
            <div class="col-12" id="chatBox">
                <div class="container d-flex h-100">
                    <div class="row align-self-center w-100">
                        <div class="col-12">
                            <input type="email" class="form-control" id="exampleFormControlInput1">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainPage',
        data() {
            return {

            }
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