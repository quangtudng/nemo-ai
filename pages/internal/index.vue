<template>
  <el-main>
    <!--  -->
  </el-main>
</template>
<script>
export default {
  layout: 'internal',
  name: 'Home',
  head() {
    return {
      title: this.$t('title.dashboard'),
    }
  },
  middleware: ['internalRedirect'],
}
</script>
