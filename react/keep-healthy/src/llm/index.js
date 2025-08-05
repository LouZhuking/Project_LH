/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions';
// 火山引擎豆包API - 文生图接口 (修正URL)
const ARK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations'


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

export const generateAvatar = async (
  text
) => {
  // 设计prompt 
  try {
    // 验证必要参数
    if (!import.meta.env.VITE_ARK_API_KEY) {
      throw new Error('ARK API Key 未设置，请检查环境变量 VITE_ARK_API_KEY');
    }

    if (!text || text.trim() === '') {
      throw new Error('文本描述不能为空');
    }

    // 网络连通性测试
    try {
      const testResponse = await fetch(ARK_API_URL, {
        method: 'OPTIONS',
        mode: 'cors'
      });
    } catch (optionsError) {
    }
    
    const requestBody = {
      model: 'doubao-seedream-3-0-t2i-250415',
      prompt: `宫崎骏动漫风格头像，${text.trim()}，个性化设计，高质量`,
      n: 1,
      size: '512x512',
      quality: 'standard',
      response_format: 'url'
    };

    // 检查是否在开发环境中，如果是则使用代理
    const isDev = import.meta.env.DEV;
    const apiUrl = isDev ? '/api/ark-proxy/images/generations' : ARK_API_URL;    

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_ARK_API_KEY}`,
        // 添加额外的请求头来避免一些CORS问题
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(requestBody)
    })

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();  
      return {
        success: false,
        error: `API 请求失败: ${response.status} ${response.statusText}`,
        details: errorText
      }
    }

    // 解析响应数据
    const data = await response.json();
    
    // 检查不同的可能响应格式
    let imageUrl;
    
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      // 标准格式: { data: [{ url: "..." }] }
      imageUrl = data.data[0].url;
    } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      // 另一种格式: { images: [{ url: "..." }] }
      imageUrl = data.images[0].url;
    } else if (data.url) {
      // 直接返回URL格式: { url: "..." }
      imageUrl = data.url;
    } else if (data.result && data.result.url) {
      // 嵌套格式: { result: { url: "..." } }
      imageUrl = data.result.url;
    }
    
    if (!imageUrl) {
      return {
        success: false,
        error: '未读取到图片 URL - 响应格式不符合预期',
        details: data
      }
    }
    
    // 返回给前端
    return {
      success: true,
      url: imageUrl
    }
  } catch(error){
    
    // 分析具体错误类型
    let errorMessage = '图片生成失败';
    let solution = '';
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage = '🚫 CORS跨域请求被阻止';
      solution = `
🔧 解决方案：
1. 在 vite.config.js 中配置代理
2. 或使用后端API中转请求
3. 检查API服务器是否允许跨域访问
      `.trim();
    } else if (error.message.includes('CORS')) {
      errorMessage = 'CORS错误，浏览器阻止了跨域请求';
      solution = '需要配置代理服务器或通过后端调用API';
    } else if (error.message.includes('API Key')) {
      errorMessage = error.message;
      solution = '请在 .env 文件中设置正确的 VITE_ARK_API_KEY';
    } else if (error.message.includes('文本描述')) {
      errorMessage = error.message;
      solution = '请输入有效的图片描述文本';
    } else if (error.name === 'TypeError') {
      errorMessage = '网络连接失败';
      solution = '请检查网络连接和API服务器状态';
    }
    
    return {
      success: false,
      error: errorMessage,
      solution: solution,
      details: error.message,
      stack: error.stack
    }
  }
}
