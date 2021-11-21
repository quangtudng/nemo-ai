export default {
  fetchMe() {
    return this.$authApi.get('/auth/me')
  },
  updateMe({ rootState, dispatch }, form) {
    return this.$authApi.post('/auth/me', form)
  },
  async login({ commit, dispatch }, { form, rememberPassword }) {
    const response = await this.$clientApi.post('/auth/signin', form)
    const auth = response.data
    if (rememberPassword) {
      localStorage.setItem('auth', JSON.stringify(auth))
    } else {
      sessionStorage.setItem('auth', JSON.stringify(auth))
    }
    commit('auth/SET_AUTH', auth, { root: true }) // Mutating to store for client rendering
  },
  logout({ commit }) {
    localStorage.removeItem('auth')
    sessionStorage.removeItem('auth')
    commit('auth/SET_AUTH', null, { root: true })
  },
}
