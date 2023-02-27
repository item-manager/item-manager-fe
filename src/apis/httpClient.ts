import { Api } from './Api'

export const httpClient = new Api({
  baseURL: '/api',
})

httpClient.instance.defaults.paramsSerializer = {
  serialize: (paramObj) => {
    const params = new URLSearchParams()
    Object.entries(paramObj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          params.append(key, item)
        })
      } else if (value !== null && value !== undefined) {
        params.append(key, value.toString())
      }
    })

    return params.toString()
  },
}

// TODO
// httpClient.instance.interceptors.response.use(
//   (response) => response,
//   function (error) {
//     if (error?.response?.status === 401) {
//       return
//     }
//   }
// )
