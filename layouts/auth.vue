<template>
  <el-container class="default-layout-container h-full-vh">
    <el-aside class="default-layout-aside bg-white" width="400px">
      <nuxt class="relative" />
    </el-aside>
    <el-container class="flex-col unauth-bg relative"></el-container>
  </el-container>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Auth',
  middleware: 'internalAuthNotRequired',
  created() {
    // We store this configuration in localStorage because it lasts forever
    this.$i18n.locale = localStorage.getItem('locale')
    this.SET_LANG(localStorage.getItem('locale')) // store in state and localStorage
  },
  methods: {
    ...mapMutations({
      SET_LANG: 'SET_LANG',
    }),
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/base/utilities/mixins';
@include maxWidth(767.98px) {
  .default-layout-container {
    height: 200vh;
    flex-direction: column-reverse;
  }
  .default-layout-aside {
    width: 100% !important;
    height: 100vh;
  }
}
.unauth-bg {
  background-image: url(~assets/img/login/bg.jpeg);
  background-size: cover;
  background-position: center;
}
</style>
