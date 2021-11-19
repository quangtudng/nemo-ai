import Vue from 'vue'
export default {
  SET_DATA(state, data) {
    Vue.set(state, 'data', data)
  },
  SET_TOTAL(state, total) {
    state.total = total
  },
  SET_CHILDREN(state, { id, children }) {
    const categoryIndex = state.data.findIndex((category) => {
      return category.id === id
    })
    state.data[categoryIndex].children = children
  },
}
