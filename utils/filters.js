import Vue from 'vue'

Vue.filter('lower', (val) => {
  return val.toUpperCase()
})

Vue.filter('formatNumber', (val) => {
  val = val ? val + '' : ''
  return val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
})

Vue.filter('formatDate', (val) => {
  const moment = require('moment')
  return moment(val).format('l')
})

Vue.filter('formatDateTime', (val) => {
  const moment = require('moment')
  return moment(val).format('DD/MM/YYYY - h:mm a')
})

Vue.filter('slugify', (val) => {
  // For more information, visit https://www.npmjs.com/package/slug
  const slug = require('slug')
  return slug(val)
})
