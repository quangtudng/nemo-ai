import Vue from 'vue'
export default {
  SET_DATA(state, data) {
    Vue.set(state, 'data', data)
  },
  SET_TOTAL(state, total) {
    Vue.set(state, 'total', total)
  },
  SET_QUERY(state, query) {
    // Delete empty properties
    let count = 0
    Object.values(query).forEach((val, index) => {
      if (!val) {
        // Everytime we delete a property
        // Object.keys will be shorten and the length will be decrease
        // So index has to be subtracted
        delete query[Object.keys(query)[index - count]]
        count++
      }
    })
    state.query = { ...state.query, ...query }
  },
  CLEAR_QUERY(state) {
    Vue.set(state, 'query', {
      page: 1,
      limit: 10,
    })
  },
  INC_QUERY_PAGE(state) {
    state.query.page++
  },
  SUB_QUERY_PAGE(state) {
    state.query.page--
  },
}
