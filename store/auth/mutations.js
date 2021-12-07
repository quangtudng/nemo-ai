import Vue from 'vue'
export default {
  SET_AUTH(state, auth) {
    Vue.set(state, 'data', auth)
  },
}
