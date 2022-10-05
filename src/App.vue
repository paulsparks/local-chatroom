<template>
  <CountingExample/>
</template>

<script>
import CountingExample from './components/CountingExample.vue';

export default {
  name: 'App',
  components: {
    CountingExample
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
