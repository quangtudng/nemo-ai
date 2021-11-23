export default {
  // Called manually in middleware in SPA mode
  nuxtServerInit({ commit }) {
    let auth = null
    const authString = sessionStorage.getItem('auth')
      ? sessionStorage.getItem('auth')
      : localStorage.getItem('auth')
    auth = JSON.parse(authString)
    commit('auth/SET_AUTH', auth)
    commit('SET_SERVER_STATE', true) // Server is ready
  },
}
