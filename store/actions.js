import { rootMutations, authMutations } from '~/constants/vuex'
export default {
  // Called manually in middleware in SPA mode
  nuxtServerInit({ commit }) {
    let auth = null
    const authString = sessionStorage.getItem('auth')
      ? sessionStorage.getItem('auth')
      : localStorage.getItem('auth')
    auth = JSON.parse(authString)
    commit(authMutations.SET.AUTH, auth)
    commit(rootMutations.SET.SERVER_STATE, true) // Server is ready
  },
}
