import qs from 'qs'
import { serviceCategoryMutations } from '~/constants/vuex'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$authApi.get(
      '/service_categories?' +
        qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit(serviceCategoryMutations.SET.DATA, response.data.data, {
      root: true,
    })
    // Fix total later
    commit(serviceCategoryMutations.SET.TOTAL, response.data.total, {
      root: true,
    })
    return response.data
  },
  async fetchChildren({ state, commit }, id) {
    const response = await this.$authApi.get(
      `/service_categories/${id}/children`
    )
    commit(
      serviceCategoryMutations.SET.CHILDREN,
      { id, children: response.data.data },
      {
        root: true,
      }
    )
    return response.data
  },
}
