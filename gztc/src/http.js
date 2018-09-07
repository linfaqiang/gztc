import axios from 'axios'
import Qs from 'qs'
import { GetCookie } from './sys.util'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  config.headers['Access-Control-Allow-Credentials'] = true
  var token = GetCookie('token') // 优化，放到store里面
  config.headers.token = token
  config.data = Qs.stringify(config.data)

  return config
}, function (error) {
  // 请求错误时做些事
  console.log('test')
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做些事
  return response
}, function (err) {
  // 请求错误时做些事
  console.log(err.response.status)
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误(400)'
        break
      case 403:
        err.message = '拒绝访问(403)'
        break
      case 404:
        err.message = '请求出错(404)'
        break
      case 408:
        err.message = '请求超时(408)'
        break
      case 413:
        err.message = '图片过大(413)'
        break
      case 500:
        err.message = '服务器错误(500)'
        break
      case 501:
        err.message = '服务未实现(501)'
        break
      case 502:
        err.message = '网络错误(502)'
        break
      case 503:
        err.message = '服务不可用(503)'
        break
      case 504:
        err.message = '网络超时(504)'
        break
      case 505:
        err.message = 'HTTP版本不受支持(505)'
        break
      default:
        err.message = `连接出错(${err.response.status})`
    }
  } else {
    err.message = '连接服务器失败'
  }
  return Promise.reject(err)
})
export default axios
