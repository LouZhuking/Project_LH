# Qute Login - 私有云登录页面

基于 Figma 设计的现代化私有云登录页面，使用 Vue 3 + TypeScript 开发。

## 项目特性

- ✨ 现代化的 UI 设计，基于 Figma 设计稿
- 🚀 Vue 3 + TypeScript + Vite 技术栈
- 📱 完全响应式设计，支持多设备
- 🎨 优雅的动画效果和交互体验
- 🔒 安全的密码显示/隐藏功能
- 🎯 支持多种登录方式（用户名密码、微信、QQ）
- ♿ 良好的可访问性支持

## 设计来源

本项目基于 Figma 设计稿实现：
[HomeCloud 登录页设计](https://www.figma.com/design/dE5O8u5afGNfY5HLk7FhAN/%E3%80%90%E7%A7%81%E6%9C%89%E4%BA%91-%E7%99%BB%E5%BD%95%E9%A1%B5%E8%AE%BE%E8%AE%A1%E3%80%91homecloud-login-page-design--Community-?node-id=5-704&t=fFWOQVR2YhbwuE3i-4)

## 技术栈

- **前端框架**: Vue 3.5+
- **语言**: TypeScript
- **构建工具**: Vite 5.4+
- **路由**: Vue Router 4.4+
- **状态管理**: Pinia 2.2+
- **样式**: CSS3 + CSS Modules

## 项目结构

```
qute-login/
├── public/                 # 静态资源
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码
│   ├── assets/           # 资源文件
│   │   ├── images/       # 图片资源
│   │   └── styles/       # 样式文件
│   ├── components/       # 组件
│   │   └── icons/        # 图标组件
│   ├── router/           # 路由配置
│   ├── views/            # 页面组件
│   ├── App.vue          # 根组件
│   └── main.ts          # 应用入口
├── index.html           # HTML 模板
├── package.json         # 依赖配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── README.md           # 项目说明
```

## 快速开始

### 安装依赖

```bash
cd WebFront/qute-login
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 类型检查

```bash
npm run type-check
```

## 功能特性

### 🎨 UI 设计特性

- **渐变背景**: 采用现代渐变色背景，营造科技感
- **毛玻璃效果**: 登录卡片使用毛玻璃材质，增强视觉层次
- **浮动动画**: 背景装饰元素具有浮动动画效果
- **响应式布局**: 完美适配桌面、平板、手机等设备

### 🔐 登录功能

- **用户名密码登录**: 支持传统的用户名密码认证
- **密码可见性切换**: 点击眼睛图标切换密码显示/隐藏
- **记住我功能**: 支持保存登录状态
- **社交登录**: 支持微信、QQ 第三方登录
- **忘记密码**: 提供密码重置功能入口

### 📱 响应式设计

- **桌面端**: 双栏布局，左侧登录表单，右侧功能介绍
- **平板端**: 上下布局，优化触摸操作
- **手机端**: 单栏垂直布局，简化操作流程

### ⚡ 性能优化

- **组件懒加载**: 按需加载组件，提升首屏速度
- **图标组件化**: SVG 图标组件化，减少资源加载
- **CSS 优化**: 使用 CSS3 动画，减少 JavaScript 依赖

## 自定义配置

### 主题色彩

可以在 `src/assets/styles/main.css` 中修改主题色彩：

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #a7f3d0;
}
```

### API 接口

在 `src/views/LoginView.vue` 的 `handleLogin` 方法中配置实际的登录 API：

```typescript
const handleLogin = async () => {
  // 替换为实际的 API 调用
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginForm)
  })
  // 处理响应...
}
```

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint 和 Prettier 保持代码风格一致
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 致谢

- 设计灵感来源于 Figma 社区
- 图标来源于 Lucide Icons
- 感谢 Vue.js 团队提供优秀的前端框架
