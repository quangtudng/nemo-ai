import qs from 'qs'
import { roleMutations } from '~/constants/vuex'
export default {
  async fetchData({ state, commit }) {
    const response = await this.$authApi.get(
      '/roles?' + qs.stringify(state.query, { arrayFormat: 'repeat' })
    )
    commit(roleMutations.SET.DATA, response.data.data, { root: true })
    // Fix total later
    commit(roleMutations.SET.TOTAL, response.data.total, { root: true })
    return response.data
  },
  async fetchPermissions({ state, commit }) {
    const response = await this.$authApi.get('/permissions?page=1&limit=500')
    commit(roleMutations.SET.PERMISSIONS, response.data.data, { root: true })
    return response.data
  },
  async fetchSingle({ rootState }, id) {
    const response = await this.$authApi.get('/roles/' + id)
    return response
  },
  async submitSingle({ rootState }, form) {
    const response = await this.$authApi.post('/roles', form)
    return response
  },
  async updateSingle({ rootState }, data) {
    const response = await this.$authApi.patch('/roles/' + data.id, data.form)
    return response
  },
  async deleteSingle({ rootState }, id) {
    const response = await this.$authApi.delete('/roles/' + id)
    return response
  },
}
