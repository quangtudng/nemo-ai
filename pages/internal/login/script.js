import { LoginForm } from '~/components/common'
export default {
  layout: 'auth',
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
        this.$router.push('/internal')
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
  },
}
