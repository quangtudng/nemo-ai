import { Message } from 'element-ui'
export default function ({ $axios, store, app }, inject) {
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
    config.headers.Authorization = 'Bearer ' + store.state.auth.data.accessToken
    if (process.env.NODE_ENV === 'development') {
      Message('DevOnly | Authenticated API executed')
    }
    // Must return config
    return config
  })
  authApi.onResponse((response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(response)
    }
    // Must return config
    return response
  })
  authApi.onError((error) => {
    if (process.env.NODE_ENV === 'development') {
      Message.error('DevOnly | Authenticated API failed to execute')
      console.log(error)
    }
    if (error?.response?.data?.message) {
      const messages = Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message]
      messages.forEach((message) => {
        Message.error(app.i18n.t('error.' + message))
      })
    } else {
      Message.error('Unknown server error')
    }
    return error
  })
  // Inject to context as $authApi
  inject('authApi', authApi)
}
