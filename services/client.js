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
    if (process.env.DEBUG === 'true') {
      setTimeout(() => {
        Message('DevOnly | Client API executed')
      }, 100)
    }
    // Must return config
    return config
  })
  clientApi.onResponse((response) => {
    if (process.env.DEBUG === 'true') {
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
        setTimeout(() => {
          Message.error(app.i18n.t('error.' + message))
        }, 100)
      })
    } else {
      setTimeout(() => {
        Message.error(app.i18n.t('error.UNKNOWN_SERVER_ERROR'))
      }, 100)
    }

    if (process.env.DEBUG === 'true') {
      setTimeout(function () {
        Message.error('DevOnly | Client API failed to execute')
        console.log(error)
      }, 100)
    }
    return error
  })

  // Inject to context as $clientApi
  inject('clientApi', clientApi)
}
