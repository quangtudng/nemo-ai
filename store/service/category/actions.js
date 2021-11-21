import qs from 'qs'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$authApi.get(
      '/service_categories?' +
        qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit('service/category/SET_DATA', response.data.data, {
      root: true,
    })
    // Fix total later
    commit('service/category/SET_TOTAL', response.data.total, {
      root: true,
    })
    return response.data
  },
  async fetchChildren({ state, commit }, id) {
    const response = await this.$authApi.get(
      `/service_categories/${id}/children`
    )
    commit(
      'service/category/SET_CHILDREN',
      { id, children: response.data.data },
      {
        root: true,
      }
    )
    return response.data
  },
}
