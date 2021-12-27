export default {
  webhook({ rootState }, body) {
    return this.$clientApi.post('/messages/webhook', body)
  },
  public_xhr({ rootState }, id) {
    return this.$clientApi.get('/messages/xhr/' + id)
  },
}
