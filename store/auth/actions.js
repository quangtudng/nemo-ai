import { authMutations } from '~/constants/vuex'
export default {
  async fetchMe() {
    const response = await this.$authApi.get('/auth/me')
    return response
  },
  async updateMe({ rootState }, form) {
    const response = await this.$authApi.post('/auth/me', form)
    return response
  },
  async login({ commit }, { form, rememberPassword }) {
    const response = await this.$clientApi.post('/auth/login', form)
    const auth = response.data.data
    console.log(response.data)
    if (rememberPassword) {
      localStorage.setItem('auth', JSON.stringify(auth))
    } else {
      sessionStorage.setItem('auth', JSON.stringify(auth))
    }
    commit(authMutations.SET.AUTH, auth, { root: true }) // Mutating to store for client rendering
  },
  logout({ commit }) {
    localStorage.removeItem('auth')
    sessionStorage.removeItem('auth')
    commit(authMutations.SET.AUTH, null, { root: true })
  },
}
