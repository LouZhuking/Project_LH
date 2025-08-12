import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: './mock',
      localEnabled: true,
    }),
  ],  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 添加代理配置解决CORS问题
  server: {
    host: '0.0.0.0',
    proxy: {
      // ARK API 代理配置
      '/api/ark-proxy': {
        target: 'https://ark.cn-beijing.volces.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ark-proxy/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            // console.log('🔥 ARK API 代理错误:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // console.log('🚀 发送代理请求:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {

          });
        },
      },
    },
  },
})
