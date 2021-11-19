import Vue from 'vue'
export default {
  SET_AUTH(state, auth) {
    Vue.set(state, 'data', auth)
  },
  SET_AUTH_FULLNAME(state, fullName) {
    Vue.set(state.data, 'fullName', fullName)
  },
  SET_AUTH_AVATAR(state, avatar) {
    Vue.set(state.data, 'avatar', avatar)
  },
}
