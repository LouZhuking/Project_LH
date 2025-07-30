# React 掘金

- 移动 App
- 模仿 App

## 技术栈

- React 全家桶
  React 组件开发
  组件的封装
  第三方组件库
  受控和非受控组件
  hooks 编程
  React-Router-DOM
  SPA
  路由守卫
  懒加载
  Zustand
- mock 接口请求
- axios 请求拦截和代理
- jwt 登录
- module css
- vite 配置
- 性能优化
  防抖 节流
  useCallback useMemo ...
- css 预处理器 stylus less

## 开发前的准备

## 开发前的准备

- 安装的包
  react-router-dom zustand axios
  react-vant(UI 组件库) lib-flexible(移动端适配)
  开发期间的依赖
  vite-plugin-mock jwt
- vite 配置
  - alias
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
    不能用 px,相对单位 rem html
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
  设置 html fontSize = window.
  innerWidth / 10
  css px 宽度 = 手机设备宽度 = 375
  1px = 2 发光源
  750px 设计稿

- 设计稿上一个盒子的大小
  - 1 像素不差的还原设计稿
  - 设计稿中像素单位
  - /75
