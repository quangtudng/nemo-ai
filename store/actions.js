export default {
  // Called manually in middleware in SPA mode
  async nuxtServerInit({ commit }) {
    let currentAuth = null
    const authString =
      sessionStorage.getItem('auth') || localStorage.getItem('auth')
    currentAuth = JSON.parse(authString)
    // Commit current Auth for access token
    commit('auth/SET_AUTH', currentAuth)
    // Attempt to get new data of current user on refresh
    if (currentAuth) {
      let newAuth = await this.$authApi.get('/auth/me')
      newAuth = { ...currentAuth, ...newAuth.data }
      commit('auth/SET_AUTH', newAuth)
    }
    // Server is ready
    commit('SET_SERVER_STATE', true)
  },
}
