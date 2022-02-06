<template>
  <el-main class="h-full">
    <div class="login-content-wrapper">
      <h1 class="login-content-title">
        {{ $t('login.title') }}
      </h1>
      <div class="sy-3"></div>
      <LoginForm
        v-loading.fullscreen.lock="isLoading"
        @my-login-form-submit="postLogin"
      />
    </div>
  </el-main>
</template>
<script src="./script.js"></script>
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
