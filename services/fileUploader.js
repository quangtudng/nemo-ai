import { Message } from 'element-ui'
import Cookies from 'js-cookie'

export default function ({ $axios, app }, inject) {
  const fileApi = (endpoint, files, folderPrefix = '') => {
    try {
      if (process.env.DEBUG === 'true') {
        Message('DevOnly | File uploading API executed')
      }
      let token = ''
      try {
        const authString = Cookies.get('auth')
        token = authString && JSON.parse(authString)?.accessToken
      } catch (error) {
        console.log(error)
      }
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append('file', file)
      }
      if (folderPrefix) {
        formData.append('folder', folderPrefix)
      }
      return $axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }
  // Inject to context as $fileUploadApi
  inject('fileApi', fileApi)
}
