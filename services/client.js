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
    if (process.env.NODE_ENV === 'development') {
      Message.error('DevOnly | Authenticated API failed to execute')
      console.log(error.response.data.mesage)
    }
    error.response.data.message.forEach((message) => {
      Message.error(app.i18n.t('error.' + message.statusCode))
    })
  })

  // Inject to context as $clientApi
  inject('clientApi', clientApi)
}
