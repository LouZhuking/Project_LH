// 中文注释：为 .vue 文件提供 TypeScript 模块声明，修复默认导入类型报错
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


