<template>
  <div id="welcomeScreen"><WelcomeScreen @confirmUsername="usernameProp = $event" /></div>
  <div id="mainPage" class="hiddenElement"><MainPage :username="usernameProp" /></div>
</template>

<script>
import WelcomeScreen from './components/WelcomeScreen.vue';
import MainPage from './components/MainPage.vue';

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
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #0f172a;
  }

  html {
    background-color: #0f172a;
  }

  .btn-primary {
    background-color: #b8dfff !important;
    border-color: #b8dfff !important;
  }

  .btn-primary {
    color: black !important;
  }

  .btn-primary:hover {
    color: black !important;
  }

  .btn-primary:active:focus {
    color: black !important;
  }

  #welcomeScreen {
    margin-top: 130px;
  }
  
  .hiddenElement {
    display: none;
  }

  .unhiddenElement {
    display: block;
  }
</style>
