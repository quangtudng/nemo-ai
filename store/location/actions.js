import qs from 'qs'
export default {
  async fetchData({ rootState }, query) {
    try {
      const result = await this.$authApi.get(
        '/locations?' + qs.stringify(query, { arrayFormat: 'repeat' })
      )
      return result
    } catch (e) {
      console.log(e)
    }
  },
  async fetchSingle({ rootState }, id) {
    try {
      const result = await this.$authApi.get('/locations/' + id)
      return result
    } catch (e) {
      console.log(e)
    }
  },
  async updateSingle({ rootState }, data) {
    try {
      const result = await this.$authApi.patch(
        '/locations/' + data.id,
        data.form
      )
      return result
    } catch (e) {
      console.log(e)
    }
  },
}
