<template>
  <div id="welcomeScreen"><WelcomeScreen/></div>
</template>

<script>
import WelcomeScreen from './components/WelcomeScreen.vue';

export default {
  name: 'App',
  components: {
    WelcomeScreen
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2f383d;
}

html {
  background-color: #2f383d;
}

#welcomeScreen {
  margin-top: 200px;
}
</style>
