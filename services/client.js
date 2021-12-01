import { Message } from 'element-ui'
export default function ({ $axios, app }, inject) {
  // Create a custom axios instance
  const clientApi = $axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  clientApi.onRequest((config) => {
    if (process.env.NODE_ENV === 'development') {
      Message('DevOnly | Client API executed')
    }
    // Must return config
    return config
  })
  clientApi.onResponse((response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(response)
    }
    // Must return config
    return response
  })
  clientApi.onError((error) => {
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

    if (process.env.NODE_ENV === 'development') {
      setTimeout(function () {
        Message.error('DevOnly | Client API failed to execute')
        console.log(error)
      }, 500)
    }
    return error
  })

  // Inject to context as $clientApi
  inject('clientApi', clientApi)
}
