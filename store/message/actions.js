export default {
  webhook({ rootState }, body) {
    return this.$clientApi.post('/messages/webhook', body)
  },
  public_xhr({ rootState }, id) {
    return this.$clientApi.get('/messages/xhr/' + id)
  },
  customer_services({ rootState }, id) {
    return this.$clientApi.get('/messages/customer_services/' + id)
  },
  weatherRequest({ rootState }, id) {
    return this.$clientApi.get('/messages/weather_request/' + id)
  },
}
