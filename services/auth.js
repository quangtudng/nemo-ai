import { Message } from 'element-ui'
import Cookies from 'js-cookie'

export default function ({ $axios, store, app, redirect }, inject) {
  // Create a custom axios instance
  const authApi = $axios.create({
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  })
  authApi.onRequest((config) => {
    let token = ''
    try {
      const authString = Cookies.get('auth')
      token = authString && JSON.parse(authString)?.accessToken
    } catch (error) {
      console.log(error)
    }
    config.headers.Authorization = 'Bearer ' + token
    if (process.env.DEBUG === 'true') {
      setTimeout(() => {
        Message('DevOnly | Authenticated API executed')
      }, 100)
    }
    // Must return config
    return config
  })
  authApi.onResponse((response) => {
    if (process.env.DEBUG === 'true') {
      console.log(response)
    }
    // Must return config
    return response
  })
  authApi.onError((error) => {
    if (process.env.DEBUG === 'true') {
      setTimeout(() => {
        Message.error('DevOnly | Authenticated API failed to execute')
      }, 100)
      console.log(error)
    }
    if (error?.response?.data?.message) {
      const messages = Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message]
      messages.forEach((message) => {
        setTimeout(() => {
          Message.error(app.i18n.t('error.' + message))
        }, 100)
      })
    } else {
      setTimeout(() => {
        Message.error(app.i18n.t('error.UNKNOWN_SERVER_ERROR'))
      }, 100)
    }
    if (error?.response?.status === 401) {
      Cookies.remove('auth')
      store.commit('auth/SET_AUTH', null, { root: true })
      redirect('/internal/login')
    }
    return error
  })
  // Inject to context as $authApi
  inject('authApi', authApi)
}
