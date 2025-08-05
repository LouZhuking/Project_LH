// 引入jsonwebtoken库，用于生成和验证JWT令牌（一种安全的用户身份认证方式）
import jwt from 'jsonwebtoken'

// 定义JWT签名的密钥（注意：这里缺少secret变量的定义，实际使用时需要定义）
const secret = 'your-secret-key'; // 添加缺失的密钥

// 导出默认的mock接口配置数组，包含两个API接口的模拟数据
export default [
  {
    // 定义登录接口的URL路径
    url: '/api/login',
    // 指定HTTP请求方法为POST（用于提交登录表单数据）
    method: 'post',
    // 设置接口响应超时时间为2秒（2000毫秒）
    timeout: 2000,
    // 定义接口的响应处理函数，req是请求对象，res是响应对象
    response: (req,res) => {
      // 从请求体中解构出用户名和密码（前端提交的登录信息）
      const {username,password} = req.body;
      // 验证用户名和密码是否正确（这里硬编码为admin/123456）
      if(username !== 'admin' || password !== '123456'){
        // 如果用户名或密码错误，返回错误信息
        return {
          code: 1,          // 错误状态码（通常非0表示失败）
          message: '用户名或密码错误',  // 错误提示信息
        }
      }
      // 如果登录成功，生成JWT令牌
      // jwt.sign()方法用于创建一个包含用户信息的加密令牌
      const token = jwt.sign({
        user:{
            id: "001",        // 用户ID
            username: "admin" // 用户名
        }
      },secret,{              // 使用密钥进行签名
        expiresIn: 86400      // 设置令牌过期时间（86400秒 = 24小时）
      })
      // 在控制台打印生成的令牌（用于调试）
      console.log(token,'----');
      // 返回登录成功的响应数据
      return {
          token,              // 返回生成的JWT令牌给前端
          data:{              // 返回用户基本信息
            id: "001",
            username: "施瓦辛格"
          }
      }
      
    }
  },
  {
    // 定义获取用户信息接口的URL路径
    url: '/api/user',
    // 指定HTTP请求方法为GET（用于获取数据）
    method: 'get',
    // 定义接口的响应处理函数
    response: (req,res) => {
        // 从请求头中获取Authorization字段，并提取JWT令牌
        // Authorization格式通常是 "Bearer token值"，所以用split(' ')[1]获取令牌部分
        const token = req.headers['Authorization'].split(' ')[1];
        // 在控制台打印收到的令牌（用于调试）
        console.log(token,'----');
        // 使用try-catch处理可能出现的令牌验证错误
        try {
          // 解码JWT令牌，验证其有效性并获取其中的用户信息
          const decoded = jwt.decode(token,secret)
          // 如果令牌有效，返回成功响应和用户信息
          return {
            code: 0,              // 成功状态码（0表示成功）
            message: 'success',   // 成功提示信息
            data: decoded.user    // 返回令牌中存储的用户信息
          }
        } catch (error) {
          // 如果令牌验证失败（过期或无效），返回错误信息
          return {
              code: 1,                // 错误状态码
              message: 'token 过期',  // 错误提示信息
          }
        }
        
    }
  }
]