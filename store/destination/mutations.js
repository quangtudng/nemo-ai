import Vue from 'vue'
export default {
  SET_DATA(state, data) {
    Vue.set(state, 'data', data)
  },
  SET_TOTAL(state, total) {
    Vue.set(state, 'total', total)
  },
  // Set region of VietNam
  ADD_REGION(state, region) {
    state.regions.push(region)
  },
}
