<template>
  <div id="main">
    <div class="error">
      <h1 class="error-line">
        <span>Error {{ error.statusCode }}</span>
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Number,
      default: 500,
    },
  },
  layout: 'error',
}
</script>
<style scoped>
* {
  transition: all 0.6s;
}

html {
  height: 100%;
}

body {
  font-family: 'Lato', sans-serif;
  color: #888;
  margin: 0;
}

#main {
  display: table;
  width: 100%;
  height: 100vh;
  text-align: center;
}

.error {
  display: table-cell;
  vertical-align: middle;
}

.error .error-line {
  font-size: 50px;
  display: inline-block;
  padding-right: 12px;
  animation: type 0.5s alternate infinite;
}

@keyframes type {
  from {
    box-shadow: inset -3px 0px 0px #888;
  }
  to {
    box-shadow: inset -3px 0px 0px transparent;
  }
}
</style>
