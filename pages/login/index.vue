<template>
  <el-main class="h-full">
    <div class="login-content-wrapper">
      <h1 class="login-content-title">
        {{ $t('login.title') }}
      </h1>
      <div class="sy-3"></div>
      <!-- Form goes here -->
      <LoginForm
        v-loading.fullscreen.lock="isLoading"
        @my-login-form-submit="postLogin"
      />
    </div>
  </el-main>
</template>

<script>
import { LoginForm } from '~/components/common'
export default {
  layout: 'client',
  // Back to home if you've already been authenticated
  components: {
    LoginForm,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    async postLogin({ form, rememberPassword }) {
      try {
        this.isLoading = true
        await this.$store.dispatch('auth/login', {
          form,
          rememberPassword,
        })
        this.$router.push('/')
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/base/layout/grid';
@import '~assets/scss/base/utilities/mixins';
.login-content-wrapper {
  width: 340px;
  @include centerAbsolute('horizontal');
  top: 200px;
}
.login-content-title {
  font-style: normal;
  font-size: 30px;
  line-height: 37px;
  text-align: center;
  color: var(--color-theme-1);
}
</style>
