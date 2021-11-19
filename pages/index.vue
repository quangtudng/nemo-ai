<template>
  <el-main>
    <!--  -->
  </el-main>
</template>
<script>
export default {
  name: 'Home',
  created() {
    // Global function and variable from mixins
    // this.sayHello("Rim")
    // console.log(this.mixinMessage)
  },
  head() {
    return {
      title: this.$t('title.dashboard'),
    }
  },
}
</script>
