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
Vue.filter('formatTime', (val) => {
  const moment = require('moment')
  return moment(val).format('h:mm a')
})
Vue.filter('slugify', (val) => {
  // For more information, visit https://www.npmjs.com/package/slug
  const slug = require('slug')
  return slug(val)
})

Vue.filter('formatRelativeTime', (val) => {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365
  const elapsed = new Date() - new Date(val)
  if (elapsed < msPerMinute) {
    return 'Live'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' m'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' h'
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' d'
  } else if (elapsed < msPerYear) {
    const month = Math.round(elapsed / msPerMonth)
    return month + month > 1 ? ' months' : ' month'
  } else {
    const year = Math.round(elapsed / msPerYear)
    return year + year > 1 ? ' years' : ' year'
  }
})
