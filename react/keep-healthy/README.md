# react keep-healthy App

- keep-healthy App
- 专门为健康管理打造的移动端 APP
- 界面主要有
  1. 首页
  2. AI 教练
  3. 运动
  4. 动作
  5. 我的
  6. 搜索
  7. 登录 - 鉴权

## 技术栈

- React 全家桶
  React 组件开发
  组件的封装
  第三方组件库
  hooks 编程 自定义的 hooks
  React-Router-DOM
  SPA
  路由守卫
  懒加载
  Zustand
- mock 接口模拟
- axios 请求拦截和代理
- jwt 登录
- module css
- vite 配置
- 性能优化
  防抖节流
  useCallback useMemo
- css 预处理器 stylus less
  flex transition transform
- LLM
  - chat
  - 生图
  - 语音
  - coze 工作流 调用
  - 流式输出
- 移动端适配
  rem 布局
- 单例模式 设计模式的理解
- git 提交等编程风格

## 项目的架构

- mock 存放模拟数据或接口
- api 后端交互请求代码
- components 可复用 React 组件
- hooks 自定义 hooks
- llm 大模型 API 调用
- pages 应用页面组件
- store 状态管理配置

## 开发前的准备

- 安装的包
  react-router-dom zustand axios
  react-vant(UI 组件库) lib-flexible(移动端适配)
  开发期间的依赖
  vite-plugin-mock jwt
- vite 配置
  - alias 配置路径别名
  - mock
  - .env.local
    llm apiKey
  - user-scalable
  - css 预处理
    index.css reset
    box-sizing font-family: -apply-system
    App.css 全局通用样式
    module.css 模块化样式
  - 移动端适配 rem
    不能用 px, 相对单位 rem html
    不同设备上体验要一致
    不同尺寸手机 等比例缩放
    设计师设计稿 750px iphone 4 375pt \*2 = 750px
    小米
    css 一行代码 手机不同尺寸 html font-size 等比例的
    layout
    flexible.js 阿里 在任何设备上
    1rem = 屏幕宽度/10
- lib-flexible
  阿里开源
  设置 html fontSize = window
  innerWidth / 10
  css px 宽度 = 手机设备宽度 = 375
  1px = 2 发光源
  750px 设计稿

- 设计稿上一个盒子的大小
  - 1 像素不差的还原设计稿
  - 设计稿中像素单位
  - /75

## 项目亮点和难点

- 移动端适配
  - lib-flexible 1rem = 屏幕宽度的/10
    - 设计稿 尺寸是 iphone 标准尺寸 750px
  - 前端的职责是还原设计稿
  - 频繁的单位 260/75 换算
  - 自动化？
    postcss + postcss-pxtorem
    postcss 是 css 预编译器，很强大
    vite 自动读取 postcss.config.js 将 css 内容编译
    px => rem

## git 提交规范

- 项目初始化
