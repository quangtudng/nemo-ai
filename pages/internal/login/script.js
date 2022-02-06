import { LoginForm } from '~/components/common'
export default {
  layout: 'auth',
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
        this.$router.push('/internal')
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    },
  },
}
