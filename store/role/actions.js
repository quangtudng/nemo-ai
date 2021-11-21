import qs from 'qs'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$authApi.get(
      '/roles?' + qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit('role/SET_DATA', response.data.data, { root: true })
    // Fix total later
    commit('role/SET_TOTAL', response.data.total, { root: true })
    return response.data
  },
}
