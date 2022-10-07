<template>
    <h1 style="color:white;">test</h1>
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