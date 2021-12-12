import Cookies from 'js-cookie'

export default {
  // Called manually in middleware in SPA mode
  async nuxtServerInit({ commit }) {
    let currentAuth = null
    const currentAuthString = Cookies.get('auth')
    if (currentAuthString) {
      // Attempt to parse cookie content
      try {
        currentAuth = JSON.parse(currentAuthString)
      } catch (error) {
        console.log(error)
      }
      // Attempt to get new data of current user on refresh
      if (currentAuth && currentAuth.accessToken) {
        let newAuth = await this.$authApi.get('/auth/me')
        newAuth = { ...currentAuth, ...newAuth.data }
        commit('auth/SET_AUTH', newAuth)
      }
    }
    // Server is ready
    commit('SET_SERVER_STATE', true)
  },
}
