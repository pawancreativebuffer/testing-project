import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000 * 5 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // token 这里加 从 cookie 里面读
    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    (response) => {
      let res = null
      try {
        res = response.data
        if (Number(res.code) === 0 || Number(res.code) === 10000) {
          return res
        } else {
          return Promise.reject(response)
        }
      } catch (e) {
        return Promise.reject(response)
      }
    },
    () => {
      return Promise.reject({ 'code': -1, 'data': null, 'message': '处理失败，请稍候' })
    }
)

export default service
