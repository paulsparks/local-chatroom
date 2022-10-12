<template>
  <div id="welcomeScreen"><WelcomeScreen @confirmUsername="usernameProp = $event" /></div>
  <div id="mainPage" class="hiddenElement"><MainPage :username="usernameProp" /></div>
</template>

<script>
import WelcomeScreen from './components/WelcomeScreen.vue';
import MainPage from './components/MainPage.vue';
import socketioService from '../services/socketio.service';

export default {
  name: 'App',
  components: {
    WelcomeScreen,
    MainPage
  },
  data() {
    return {
      usernameProp: ''
    }
  },
  created() {
    socketioService.setupSocketConnection()
  },
  beforeUnmount() {
    socketioService.disconnect()
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
  
  .hiddenElement {
    display: none;
  }

  .unhiddenElement {
    display: block;
  }
</style>
