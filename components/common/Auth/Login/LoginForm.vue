<template>
  <div>
    <FormWrapper @my-form-submit="onSubmit">
      <InputWrapper
        rules="required|email"
        :label="$t('login.email')"
        label-for="login-input-email"
        class="login-input-group"
      >
        <el-input
          id="login-input-email"
          v-model="form.email"
          type="tel"
          :placeholder="$t('login.email') + '...'"
        ></el-input>
      </InputWrapper>
      <InputWrapper
        rules="required"
        :label="$t('login.password')"
        label-for="login-input-password"
        class="login-input-group"
      >
        <el-input
          id="login-input-password"
          v-model="form.password"
          type="password"
          :placeholder="$t('login.password') + '...'"
        ></el-input>
      </InputWrapper>
      <div style="margin-top: 10px;">
        <el-checkbox
          v-model="rememberPassword"
          class="float-left login-input-remember"
        >
          {{ $t('login.remember') }}
        </el-checkbox>
        <nuxt-link to="" class="float-right login-input-forgot-password">
          {{ $t('login.forgot-password') }}
        </nuxt-link>
      </div>
      <div class="text-center flex justify-center" style="margin-top: 89px;">
        <el-button
          native-type="submit"
          type="primary"
          class="login-input-submit bg-theme-1 hover:bg-theme-1-700"
        >
          {{ $t('login.button') }}
        </el-button>
      </div>
    </FormWrapper>
  </div>
</template>
<script>
// import { FormWrapper, InputWrapper } from '~/components/common'
// You can't import common components into a common component using index.js in '~/components/common'
import FormWrapper from '../../Templates/Form/FormWrapper.vue'
import InputWrapper from '../../Templates/Form/InputWrapper.vue'
export default {
  components: {
    FormWrapper,
    InputWrapper,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      rememberPassword: false,
    }
  },
  methods: {
    onSubmit() {
      this.$emit('my-login-form-submit', {
        form: this.form,
        rememberPassword: this.rememberPassword,
      })
    },
  },
}
</script>
<style lang="scss" scoped src="./style-scoped.scss"></style>
<style lang="scss" src="./style.scss"></style>
