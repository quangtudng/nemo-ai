import { rootMutations, authMutations } from '~/constants/vuex'
export default {
  // Called manually in middleware in SPA mode
  async nuxtServerInit({ commit }) {
    let auth = null
    const authString = sessionStorage.getItem('auth')
      ? sessionStorage.getItem('auth')
      : localStorage.getItem('auth')
    auth = await JSON.parse(authString)
    auth = {
      role: 'ADMIN',
      avatar: require('~/assets/img/default-man.png'),
    }
    commit(authMutations.SET.AUTH, auth)
    commit(rootMutations.SET.SERVER_STATE, true) // Server is ready
  },
}
