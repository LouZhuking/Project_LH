# 环境变量设置指南

## 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件，添加以下内容：

```env
# OpenAI API 配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE_URL=https://api.openai.com/v1

# Supabase 配置
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

## 获取 API 密钥

### OpenAI API
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API 密钥
3. 复制密钥到 `OPENAI_API_KEY`

### Supabase
1. 访问 https://supabase.com/dashboard
2. 创建新项目或选择现有项目
3. 在项目设置中找到 API 密钥
4. 复制 URL 和 anon key

## 数据库设置

在 Supabase 控制台的 SQL 编辑器中运行 `database-setup.sql` 文件中的代码。
