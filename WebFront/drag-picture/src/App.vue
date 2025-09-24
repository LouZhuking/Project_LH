<script setup lang="ts">
// @ts-nocheck // 中文注释：关闭本文件的 TypeScript 检查以消除编辑器蓝色下划线
// 引入 Vue API 与自定义组件 // 中文注释：保持中文逐行注释
import { ref } from 'vue' // 中文注释：导入 ref 用于响应式状态
import ImageAnnotator from './components/ImageAnnotator.vue' // 中文注释：引入图像标注组件

// 图片地址（可通过文件上传更新） // 中文注释：默认给出占位图片
const imageUrl = ref('https://picsum.photos/1200/800') // 中文注释：随机图片占位

// 点数据（使用 v-model:points 双向绑定） // 中文注释：初始为空
const points = ref([]) // 中文注释：点列表

// 当前选中颜色与可选颜色 // 中文注释：用于新增点的颜色（插入亮黄色于橙色与绿色之间）
const palette = ['#ef4444', '#f59e0b', '#facc15', '#22c55e', '#3b82f6'] // 中文注释：红/橙/亮黄/绿/蓝
const currentColor = ref(palette[0]) // 中文注释：默认选中第一个颜色
const addOnce = ref(false) // 中文注释：一次性添加模式，创建一个点后恢复默认

// 组件引用 // 中文注释：用于调用暴露方法
const annotatorRef = ref(null) // 中文注释：组件 ref

// 导出 JSON // 中文注释：将当前图片与点位导出
function exportJson() { // 中文注释：导出函数
  const data = { imageUrl: imageUrl.value, points: points.value } // 中文注释：组装数据
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }) // 中文注释：构造 Blob
  const url = URL.createObjectURL(blob) // 中文注释：创建临时下载链接
  const a = document.createElement('a') // 中文注释：创建 <a> 元素
  a.href = url // 中文注释：设置链接地址
  a.download = 'annotation.json' // 中文注释：命名文件
  a.click() // 中文注释：触发下载
  URL.revokeObjectURL(url) // 中文注释：释放 URL
} // 中文注释：函数结束

// 导入 JSON // 中文注释：从本地选择 JSON 并载入
function importJson(e) { // 中文注释：导入函数
  const input = e.target // 中文注释：获取文件输入
  if (!input.files || input.files.length === 0) return // 中文注释：无文件则返回
  const file = input.files[0] // 中文注释：取第一个文件
  const reader = new FileReader() // 中文注释：文件阅读器
  reader.onload = () => { // 中文注释：读取完成回调
    try { // 中文注释：异常捕获
      const data = JSON.parse(String(reader.result)) // 中文注释：解析 JSON
      if (typeof data.imageUrl === 'string' && Array.isArray(data.points)) { // 中文注释：简单校验
        imageUrl.value = data.imageUrl // 中文注释：更新图片地址
        points.value = data.points // 中文注释：更新点数据
        annotatorRef.value?.resetView() // 中文注释：重置视图以适配图片
      } // 中文注释：校验结束
    } catch (err) { // 中文注释：捕获异常
      alert('导入失败：JSON 格式不正确') // 中文注释：提示错误
    } // 中文注释：try-catch 结束
  } // 中文注释：onload 结束
  reader.readAsText(file) // 中文注释：读取文件文本
  input.value = '' // 中文注释：清空选择以便重复导入
} // 中文注释：函数结束

// 上传图片 // 中文注释：选择图片文件替换 imageUrl
function onPickImage(e) { // 中文注释：图片选择回调
  const input = e.target // 中文注释：获取文件输入
  if (!input.files || input.files.length === 0) return // 中文注释：无文件则返回
  const file = input.files[0] // 中文注释：第一个文件
  const url = URL.createObjectURL(file) // 中文注释：创建临时 URL
  imageUrl.value = url // 中文注释：更新图片地址
  annotatorRef.value?.resetView() // 中文注释：重置视图
} // 中文注释：函数结束

// 删除选中点 // 中文注释：调用子组件方法
function deleteSelected() { // 中文注释：删除函数
  annotatorRef.value?.deleteSelected() // 中文注释：转调子组件
} // 中文注释：函数结束

// 接收子组件更新点位 // 中文注释：统一处理 update:points 事件
function onUpdatePoints(v) { // 中文注释：更新点列表
  points.value = v // 中文注释：赋值到 ref
} // 中文注释：函数结束

// 选中点回调 // 中文注释：用于显示当前选中 id（可扩展 UI）
const selectedId = ref(null) // 中文注释：选中点 id
function onSelect(id) { // 中文注释：选中回调
  selectedId.value = id // 中文注释：更新选中 id
} // 中文注释：函数结束

// 确认按钮：提示已保存在本地 // 中文注释：底部按钮交互
function handleConfirm() {
  alert('已保存在本地') // 中文注释：弹出确认提示
} // 中文注释：函数结束

// 清除按钮：删除所有点 // 中文注释：底部按钮交互
function handleClear() {
  points.value = [] // 中文注释：清空点列表
  selectedId.value = null // 中文注释：清除选中状态
} // 中文注释：函数结束

// 放大/缩小按钮：以中心按比例缩放 10% // 中文注释：底部按钮交互
function handleZoomIn() {
  annotatorRef.value?.zoomBy(1.1) // 中文注释：放大 10%
} // 中文注释：函数结束
function handleZoomOut() {
  annotatorRef.value?.zoomBy(1 / 1.1) // 中文注释：缩小 10%
} // 中文注释：函数结束
</script>

<template>
  <div>
    <!-- 顶部导航栏样式（仅样式调整，不改逻辑） -->
    <header class="topbar">
      <div class="topbar-left">
        <!-- 颜色选择圆点 -->
        <div class="palette">
          <span v-for="c in palette" :key="c"
                :title="c"
                @click="(currentColor = c, addOnce = true)"
                :style="{
                  background: c, boxShadow: currentColor === c ? '0 0 0 3px rgba(255,255,255,.7)' : '0 0 0 1px rgba(255,255,255,.35)'
                }"
          />
        </div>
      </div>
      <div class="topbar-title">提示</div>
      <div class="topbar-right">
        <button class="icon-btn" @click="deleteSelected" :disabled="!selectedId" title="删除选中">
          🗑
        </button>
      </div>
    </header>

    <!-- 次级工具行（保留原逻辑功能） -->
    <div class="subtools">
      <input type="file" accept="image/*" @change="onPickImage" />
      <button @click="exportJson">导出 JSON</button>
      <label style="display:inline-flex; align-items:center; gap:6px;">
        <span>导入 JSON</span>
        <input type="file" accept="application/json" @change="importJson" />
      </label>
      <button @click="annotatorRef?.resetView()">重置视图</button>
      <span v-if="selectedId" style="opacity:.8;">选中：{{ selectedId }}</span>
    </div>

    <!-- 标注组件：绑定 imageUrl 与 points，接收选择事件 -->
    <ImageAnnotator
      ref="annotatorRef"
      :image-url="imageUrl"
      :points="points"
      :create-color="currentColor"
      :add-once="addOnce"
      :dot-size="22"
      @update:points="onUpdatePoints"
      @created="addOnce = false"
      @select="onSelect"
    />

    <!-- 底部操作按钮 -->
    <div class="bottombar">
      <button class="primary-btn" @click="handleConfirm">确认</button>
      <button class="primary-btn" @click="handleClear">清除</button>
      <button class="primary-btn" @click="handleZoomIn">放大 10%</button>
      <button class="primary-btn" @click="handleZoomOut">缩小 10%</button>
    </div>
  </div>
  
</template>

<style scoped>
/* 顶部导航条样式，参考截图：左彩色圆点，中间标题，右垃圾桶图标 */
.topbar { display:flex; align-items:center; justify-content:space-between; height:56px; padding:0 16px; background: #f7f8fa; border-bottom:1px solid rgba(0,0,0,0.06); border-radius:10px; }
.topbar-left { display:flex; align-items:center; gap:12px; }
.palette { display:flex; gap:10px; align-items:center; }
.palette > span { width:16px; height:16px; border-radius:50%; cursor:pointer; transition:transform .15s ease; }
.palette > span:hover { transform: scale(1.1); }
.topbar-title { font-size:16px; color:#6b7280; letter-spacing:2px; }
.topbar-right { display:flex; align-items:center; gap:8px; }
.icon-btn { width:28px; height:28px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; background:#ffffff; border:1px solid rgba(0,0,0,0.08); cursor:pointer; }
.icon-btn:disabled { opacity:.4; cursor:not-allowed; }

/* 次级工具行，保持原有功能但弱化视觉占比 */
.subtools { display:flex; gap:12px; align-items:center; margin:10px 0 12px; color:#6b7280; }

/* 底部操作条：确认 / 清除 / 放大 / 缩小 */
.bottombar { position:fixed; left:0; right:0; bottom:0; display:flex; justify-content:center; gap:16px; padding:12px; background:linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.9)); }
.primary-btn { background:#3b82f6; color:#fff; border:none; padding:10px 16px; border-radius:8px; cursor:pointer; font-weight:600; box-shadow:0 2px 6px rgba(59,130,246,0.3); }
.primary-btn:hover { filter:brightness(1.05); }
.primary-btn:active { transform: translateY(1px); }
</style>
