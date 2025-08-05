import {
  create
} from 'zustand'
import {
  doLogin
} from '@/api/user'

export const useUserStore = create((set,get) => ({
  user: null,  // 用户信息
  isLogin: false, // 是否登录
  loginError: null, // 登录错误信息
  login: async ({username, password}) => {
    try {
      // 清除之前的错误信息
      set({ loginError: null });
      
      const res = await doLogin({username, password})
      console.log(res);
      
      // 检查响应数据结构
      const responseData = res.data;
      
      // 检查是否登录成功（code为1表示失败，有message表示失败）
      if (responseData.code === 1 || responseData.message === '用户名或密码错误') {
        set({ 
          loginError: responseData.message || '登录失败',
          isLogin: false 
        });
        throw new Error(responseData.message || '登录失败');
      }
      
      // 登录成功的情况
      const {token, data: user} = responseData;
      console.log(token, user, '----');

      localStorage.setItem('token', token)
      set({
        user,
        isLogin: true,
        loginError: null
      })
      
      return { success: true };
      
    } catch (error) {
      console.error('登录失败:', error);
      set({ 
        loginError: error.message || '登录失败，请重试',
        isLogin: false 
      });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      isLogin: false
    })
  }
}))

export default useUserStore