<script>
  export default {
    data() {
      return {
        number: 0
      }
    },
  
    methods: {
      incrementNumber() {
        this.number++
      }
    }
  }
</script>

<template>
  <button @:click="incrementNumber">{{ number }}</button>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
