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
  <button @:click="number++">{{ number }}</button>
  <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Check Bootstrap
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
