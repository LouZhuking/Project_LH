import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5173/api'

// 请求响应拦截器
axios.interceptors.request.use((config) => {
  // 在请求发送之前做一些处理
  return config
})

// 配置axios 响应拦截器，成功响应处理
axios.interceptors.response.use((data) => {
  return data.data
})


export default axios