/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions';
const KIM_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';


export const chat = async (
  messages,
  api_url = DEEPSEEK_CHAT_API_URL,
  api_key=import.meta.env.VITE_DEEPSEEK_API_KEY,
  model='deepseek-chat'
) => {
  // 使用try catch 方式使代码更稳定
  try{
    // 1. 发送http请求
    const response = await fetch(api_url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      })
    })
    // 2. 接收数据
    // 等待并解析API返回的响应数据为JSON格式
    const data = await response.json();
    // 3. 返回标准化的成功响应对象
    return {
      code: 0, 
      data:{
        role: 'assistant',  // 角色标识 表示是ai助手的回复
        content: data.choices[0].message.content // 提取API返回的AI回复内容
      }
    }

  } catch(err){
      return{
        code: 0,
        msg: '出错了...'
      }
  }
}

export const generateAvatar = async (text) => {
  // 设计prompt 
  const prompt = `
  你是一位宫崎骏动漫设计师，需要为用户设计头像，主打宫崎骏电影风格。
  用户的信息是${text}
  要求由个性，有设计感。
  `
}