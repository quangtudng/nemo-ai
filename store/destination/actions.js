import qs from 'qs'
import { destinationMutations } from '~/constants/vuex'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$authApi.get(
      '/destinations?' + qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit(destinationMutations.SET.DATA, response.data.data, {
      root: true,
    })
    // Fix total later
    commit(destinationMutations.SET.TOTAL, response.data.total, {
      root: true,
    })
    return response.data
  },
  async fetchSingle({ rootState }, id) {
    const response = await this.$clientApi.get('/destinations/' + id)
    return response
  },
}
