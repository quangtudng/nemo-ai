import Cookies from 'js-cookie'

export default {
  fetchMe() {
    return this.$authApi.get('/auth/me')
  },
  updateMe({ rootState }, form) {
    return this.$authApi.post('/auth/me', form)
  },
  async login({ commit }, { form, rememberPassword }) {
    const response = await this.$clientApi.post('/auth/signin', form)
    const authData = response.data
    if (authData) {
      if (rememberPassword) {
        Cookies.set('auth', JSON.stringify(authData), { expires: 30 })
      } else {
        Cookies.set('auth', JSON.stringify(authData), { expires: 1 })
      }
      commit('auth/SET_AUTH', authData, { root: true })
    }
  },
  logout({ commit }) {
    Cookies.remove('auth')
    commit('auth/SET_AUTH', null, { root: true })
  },
}
