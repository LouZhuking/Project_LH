import axios from 'axios'

// 动态获取baseURL，支持手机访问
const getBaseURL = () => {
  // 开发环境下，如果是localhost，使用当前访问的host
  if (import.meta.env.DEV) {
    const currentHost = window.location.host;
    return `${window.location.protocol}//${currentHost}/api`;
  }
  // 生产环境
  return '/api';
};

axios.defaults.baseURL = getBaseURL();

// 请求响应拦截器
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || ""
  // 在请求发送之前做一些处理
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 配置axios 响应拦截器，成功响应处理
axios.interceptors.response.use((data) => {
  return data.data
})


export default axios