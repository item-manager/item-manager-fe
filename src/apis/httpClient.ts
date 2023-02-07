import { Api } from './Api'

export const httpClient = new Api({
  baseURL: '/api',
})

// TODO
// httpClient.instance.interceptors.response.use(
//   (response) => response,
//   function (error) {
//     if (error?.response?.status === 401) {
//       return
//     }
//   }
// )
