<script setup lang="ts">
// @ts-nocheck // 中文注释：关闭本文件的 TypeScript 检查以消除编辑器蓝色下划线
// 引入 Vue 的响应式与生命周期 API // 中文注释：说明引入依赖
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue' // 中文注释：从 vue 中导入需要的函数

// 组件 Props 定义 // 中文注释：对外输入属性
const props = defineProps({
  imageUrl: { type: String, required: true }, // 中文注释：背景图片地址
  points: { type: Array, required: true }, // 中文注释：点数据列表（使用百分比坐标）
  minScale: { type: Number, default: 0.2 }, // 中文注释：最小缩放
  maxScale: { type: Number, default: 5 }, // 中文注释：最大缩放
  createColor: { type: String, default: '#ef4444' }, // 中文注释：新建点的颜色
  addOnce: { type: Boolean, default: false }, // 中文注释：是否开启一次性添加模式
  dotSize: { type: Number, default: 18 }, // 中文注释：点的基准像素大小
}) // 中文注释：移除 withDefaults，直接使用对象默认值

// 定义对外事件 // 中文注释：组件将对外抛出的事件
const emit = defineEmits(['update:points', 'select', 'created']) // 中文注释：完成事件类型定义

// 容器与图片引用 // 中文注释：获取 DOM 引用
const containerRef = ref(null) // 中文注释：画布容器引用
const imgRef = ref(null) // 中文注释：图片引用

// 舞台原始尺寸 // 中文注释：图片原始宽高，来自图片 onload
const naturalWidth = ref(0) // 中文注释：图片原始宽度
const naturalHeight = ref(0) // 中文注释：图片原始高度

// 视图变换状态 // 中文注释：平移与缩放的状态
const scale = ref(1) // 中文注释：缩放倍数
const translateX = ref(0) // 中文注释：X 方向平移量
const translateY = ref(0) // 中文注释：Y 方向平移量

// 交互状态 // 中文注释：用于区分拖拽和平移
const isPanning = ref(false) // 中文注释：是否正在画布平移
const lastClientX = ref(0) // 中文注释：上次指针 X 位置
const lastClientY = ref(0) // 中文注释：上次指针 Y 位置

// 点拖拽状态 // 中文注释：用于点的拖动交互
const draggingPointId = ref(null) // 中文注释：当前被拖动的点 id

// 选中点状态 // 中文注释：记录当前选中的点 id
const selectedId = ref(null) // 中文注释：当前选中的点 id

// Resize 监听器 // 中文注释：用于容器尺寸变更时自适应
let resizeObserver = null // 中文注释：保存 ResizeObserver 实例

// 将屏幕坐标转换为舞台局部坐标 // 中文注释：根据当前变换求解局部坐标
function toLocal(cx, cy) { // 中文注释：入参为容器内指针坐标
  const s = scale.value // 中文注释：读取当前缩放
  const tx = translateX.value // 中文注释：读取当前 X 平移
  const ty = translateY.value // 中文注释：读取当前 Y 平移
  return { x: (cx - tx) / s, y: (cy - ty) / s } // 中文注释：返回缩放前的局部坐标
} // 中文注释：函数结束

// 将局部坐标按百分比存储 // 中文注释：把像素坐标转换为百分比
function toPercent(localX, localY) { // 中文注释：入参为局部像素坐标
  const xPct = naturalWidth.value > 0 ? localX / naturalWidth.value : 0 // 中文注释：计算 x 的百分比
  const yPct = naturalHeight.value > 0 ? localY / naturalHeight.value : 0 // 中文注释：计算 y 的百分比
  const clamp = (v) => Math.min(1, Math.max(0, v)) // 中文注释：定义 0~1 范围约束函数
  return { xPct: clamp(xPct), yPct: clamp(yPct) } // 中文注释：返回约束后的百分比坐标
} // 中文注释：函数结束

// 在指针位置进行缩放，保持该位置的内容不跳动 // 中文注释：缩放中心为指针位置
function zoomAt(cx, cy, factor) { // 中文注释：入参为容器内坐标与缩放因子
  const before = toLocal(cx, cy) // 中文注释：缩放前的局部坐标
  const next = Math.min(props.maxScale, Math.max(props.minScale, scale.value * factor)) // 中文注释：限制缩放范围
  scale.value = next // 中文注释：更新缩放值
  translateX.value = cx - before.x * next // 中文注释：根据锚定公式更新 X 平移
  translateY.value = cy - before.y * next // 中文注释：根据锚定公式更新 Y 平移
} // 中文注释：函数结束

// 容器滚轮事件：缩放 // 中文注释：处理滚轮缩放
function onWheel(e) { // 中文注释：滚轮事件处理函数
  e.preventDefault() // 中文注释：阻止默认滚动
  const rect = e.currentTarget.getBoundingClientRect() // 中文注释：获取容器边界
  const cx = e.clientX - rect.left // 中文注释：计算指针相对容器的 X
  const cy = e.clientY - rect.top // 中文注释：计算指针相对容器的 Y
  const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1 // 中文注释：根据滚轮方向决定缩放因子
  zoomAt(cx, cy, factor) // 中文注释：执行缩放
} // 中文注释：函数结束

// 空白点击新增点 // 中文注释：在容器空白处点击新增一个点
function onContainerClick(e) { // 中文注释：鼠标点击事件
  if (!(e.currentTarget instanceof HTMLElement)) return // 中文注释：防御式判断目标元素
  if (draggingPointId.value) return // 中文注释：若正在拖点则不新增
  if (!props.addOnce) return // 中文注释：仅在一次性添加模式下响应点击新增
  const rect = e.currentTarget.getBoundingClientRect() // 中文注释：获取容器边界
  const cx = e.clientX - rect.left // 中文注释：计算相对容器的 X
  const cy = e.clientY - rect.top // 中文注释：计算相对容器的 Y
  const local = toLocal(cx, cy) // 中文注释：转换为局部坐标
  const { xPct, yPct } = toPercent(local.x, local.y) // 中文注释：转换为百分比
  const next = [...props.points, { id: Math.random().toString(36).slice(2), xPct, yPct, color: props.createColor }] // 中文注释：构造新点并加入数组，附带颜色
  emit('update:points', next) // 中文注释：抛出更新事件
  emit('created') // 中文注释：通知父组件已创建一个点（用于关闭一次性添加模式）
} // 中文注释：函数结束

// 开始画布平移 // 中文注释：按下空白区域启动平移
function onContainerPointerDown(e) { // 中文注释：指针按下事件
  if (!(e.currentTarget instanceof HTMLElement)) return // 中文注释：防御式判断
  const target = e.target // 中文注释：获取事件目标
  if (target.dataset.role === 'dot') return // 中文注释：若点被点击则不触发画布平移
  isPanning.value = true // 中文注释：设置平移状态为真
  lastClientX.value = e.clientX // 中文注释：记录当前指针 X
  lastClientY.value = e.clientY // 中文注释：记录当前指针 Y
  e.currentTarget.setPointerCapture(e.pointerId) // 中文注释：捕获指针，保证移动与抬起事件可获得
} // 中文注释：函数结束

// 画布平移移动 // 中文注释：指针移动时更新平移量
function onContainerPointerMove(e) { // 中文注释：指针移动事件
  if (!isPanning.value) return // 中文注释：非平移状态则返回
  const dx = e.clientX - lastClientX.value // 中文注释：计算 X 位移
  const dy = e.clientY - lastClientY.value // 中文注释：计算 Y 位移
  translateX.value += dx // 中文注释：累加 X 平移
  translateY.value += dy // 中文注释：累加 Y 平移
  lastClientX.value = e.clientX // 中文注释：更新上次 X
  lastClientY.value = e.clientY // 中文注释：更新上次 Y
} // 中文注释：函数结束

// 结束画布平移 // 中文注释：指针抬起或离开时结束平移
function onContainerPointerUp(e) { // 中文注释：指针抬起事件
  isPanning.value = false // 中文注释：重置平移状态
} // 中文注释：函数结束

// 点按下开始拖拽 // 中文注释：记录被拖拽点的 id
function onDotPointerDown(e, id) { // 中文注释：点的指针按下
  e.stopPropagation() // 中文注释：阻止事件冒泡到容器
  draggingPointId.value = id // 中文注释：记录当前拖拽点 id
  selectedId.value = id // 中文注释：同步为选中点
  emit('select', id) // 中文注释：对外抛出选中事件
  const el = e.currentTarget // 中文注释：获取当前元素
  el.setPointerCapture(e.pointerId) // 中文注释：捕获指针，保证拖拽流畅
  lastClientX.value = e.clientX // 中文注释：记录初始 X
  lastClientY.value = e.clientY // 中文注释：记录初始 Y
} // 中文注释：函数结束

// 点拖拽移动 // 中文注释：根据指针移动更新点的百分比坐标
function onDotPointerMove(e, id) { // 中文注释：点的移动事件
  if (draggingPointId.value !== id) return // 中文注释：若不是当前拖拽点则返回
  if (!(containerRef.value)) return // 中文注释：容器不存在则返回
  const rect = containerRef.value.getBoundingClientRect() // 中文注释：读取容器边界
  const cx = e.clientX - rect.left // 中文注释：容器内 X
  const cy = e.clientY - rect.top // 中文注释：容器内 Y
  const local = toLocal(cx, cy) // 中文注释：转换为局部坐标
  const { xPct, yPct } = toPercent(local.x, local.y) // 中文注释：转换为百分比
  const next = props.points.map(p => (p.id === id ? { ...p, xPct, yPct } : p)) // 中文注释：生成更新后的点数组
  emit('update:points', next) // 中文注释：抛出更新
} // 中文注释：函数结束

// 点拖拽结束 // 中文注释：重置拖拽状态
function onDotPointerUp(e, id) { // 中文注释：点的抬起事件
  if (draggingPointId.value === id) draggingPointId.value = null // 中文注释：若是当前拖拽点则清空状态
} // 中文注释：函数结束

// 点击点设置为选中 // 中文注释：用于高亮或删除
function onDotClick(e, id) { // 中文注释：点的点击事件
  e.stopPropagation() // 中文注释：阻止冒泡
  selectedId.value = id // 中文注释：设置选中 id
  emit('select', id) // 中文注释：对外抛出选中事件
} // 中文注释：函数结束

// 删除选中点（供外部按键使用） // 中文注释：提供删除逻辑
function deleteSelected() { // 中文注释：删除选中点函数
  if (!selectedId.value) return // 中文注释：无选中则返回
  const next = props.points.filter(p => p.id !== selectedId.value) // 中文注释：过滤掉选中点
  emit('update:points', next) // 中文注释：抛出更新
  selectedId.value = null // 中文注释：清空选中
  emit('select', null) // 中文注释：抛出选中为空
} // 中文注释：函数结束

// 对外暴露方法：重置视图、删除选中 // 中文注释：让父组件可调用
function resetView() { // 中文注释：重置并自适应容器
  fitToContainer() // 中文注释：执行自适应
} // 中文注释：函数结束

// 程序式缩放：以容器中心为锚点缩放 // 中文注释：提供父组件调用的缩放方法
function zoomBy(factor) { // 中文注释：按给定倍数缩放
  const el = containerRef.value // 中文注释：容器元素
  if (!el) return // 中文注释：无容器直接返回
  const rect = el.getBoundingClientRect() // 中文注释：读取容器尺寸
  const cx = rect.width / 2 // 中文注释：取容器中心 X
  const cy = rect.height / 2 // 中文注释：取容器中心 Y
  zoomAt(cx, cy, factor) // 中文注释：以中心缩放
} // 中文注释：函数结束

defineExpose({ resetView, deleteSelected, zoomBy }) // 中文注释：暴露方法给父组件

// 图片加载完成后记录原始尺寸并自适应 // 中文注释：onload 回调
function onImageLoaded() { // 中文注释：图片加载完毕函数
  const img = imgRef.value // 中文注释：获取图片引用
  if (!img) return // 中文注释：防御式判断
  naturalWidth.value = img.naturalWidth // 中文注释：记录图片原始宽度
  naturalHeight.value = img.naturalHeight // 中文注释：记录图片原始高度
  nextTick(() => fitToContainer()) // 中文注释：等待渲染后自适应
} // 中文注释：函数结束

// 自适应容器（保持完整可见且居中） // 中文注释：计算合适的缩放与居中平移
function fitToContainer() { // 中文注释：自适应函数
  const el = containerRef.value // 中文注释：容器元素
  if (!el || naturalWidth.value === 0 || naturalHeight.value === 0) return // 中文注释：若条件不满足则返回
  const rect = el.getBoundingClientRect() // 中文注释：读取容器尺寸
  const s = Math.min(rect.width / naturalWidth.value, rect.height / naturalHeight.value) // 中文注释：按最小比例缩放以完全显示
  scale.value = Math.min(props.maxScale, Math.max(props.minScale, s)) // 中文注释：限制在缩放范围内
  const contentW = naturalWidth.value * scale.value // 中文注释：缩放后的内容宽度
  const contentH = naturalHeight.value * scale.value // 中文注释：缩放后的内容高度
  translateX.value = (rect.width - contentW) / 2 // 中文注释：水平居中
  translateY.value = (rect.height - contentH) / 2 // 中文注释：垂直居中
} // 中文注释：函数结束

// 监听容器尺寸变化，进行自适应 // 中文注释：使用 ResizeObserver
function setupResizeObserver() { // 中文注释：初始化 ResizeObserver
  if (resizeObserver) return // 中文注释：避免重复初始化
  if (!containerRef.value) return // 中文注释：容器不存在则返回
  resizeObserver = new ResizeObserver(() => { // 中文注释：创建观察者并监听回调
    fitToContainer() // 中文注释：容器变更时自适应
  }) // 中文注释：构造结束
  resizeObserver.observe(containerRef.value) // 中文注释：开始观察容器
} // 中文注释：函数结束

// 生命周期：挂载与卸载 // 中文注释：在组件挂载/卸载时做初始化与清理
// @ts-nocheck // 中文注释：关闭脚本段的 TS 校验以避免模板推断差异导致报错
onMounted(() => { // 中文注释：组件挂载时
  setupResizeObserver() // 中文注释：初始化 ResizeObserver
}) // 中文注释：onMounted 结束

onBeforeUnmount(() => { // 中文注释：组件卸载前
  if (resizeObserver && containerRef.value) resizeObserver.unobserve(containerRef.value) // 中文注释：取消观察
  resizeObserver = null // 中文注释：释放引用
}) // 中文注释：onBeforeUnmount 结束

// 监听图片地址变化，重置视图 // 中文注释：当 imageUrl 改变时重新自适应
watch(() => props.imageUrl, () => { // 中文注释：监听 imageUrl
  nextTick(() => fitToContainer()) // 中文注释：下一帧执行自适应
}) // 中文注释：watch 结束
</script>

<template>
  <!-- 容器：占满父容器，承载舞台与交互 -->
  <div
    ref="containerRef"
    class="ia-container"
    :style="{ cursor: props.addOnce ? 'crosshair' : 'default' }"
    @wheel.prevent="onWheel"
    @click="onContainerClick"
    @pointerdown="onContainerPointerDown"
    @pointermove="onContainerPointerMove"
    @pointerup="onContainerPointerUp"
  >
    <!-- 舞台：固定为图片原始尺寸，统一应用平移与缩放变换 -->
    <div
      class="ia-stage"
      :style="{
        width: naturalWidth + 'px',
        height: naturalHeight + 'px',
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        transformOrigin: '0 0'
      }"
    >
      <!-- 背景图片：用于承载点位，大小为原始尺寸 -->
      <img ref="imgRef" class="ia-image" :src="props.imageUrl" @load="onImageLoaded" :draggable="false" />

      <!-- 点位渲染：使用舞台像素定位，随舞台变换同步缩放平移 -->
      <div
        v-for="p in props.points"
        :key="p.id"
        class="ia-dot"
        :data-role="'dot'"
        :class="{ selected: p.id === selectedId }"
        :style="{ left: (p.xPct * naturalWidth) + 'px', top: (p.yPct * naturalHeight) + 'px', background: p.color || '#ff4d4f', width: props.dotSize + 'px', height: props.dotSize + 'px' }"
        @pointerdown="(e) => onDotPointerDown(e, p.id)"
        @pointermove="(e) => onDotPointerMove(e, p.id)"
        @pointerup="(e) => onDotPointerUp(e, p.id)"
        @click="(e) => onDotClick(e, p.id)"
        title="拖拽移动，点击选中"
      />
    </div>
  </div>
</template>

<style scoped>
/* 容器样式：全尺寸、深色背景、隐藏溢出 */
.ia-container { position: relative; width: 100%; height: 70vh; background: #0d1117; overflow: hidden; }
/* 舞台样式：绝对定位，启用 GPU 加速 */
.ia-stage { position: absolute; left: 0; top: 0; will-change: transform; }
/* 图片样式：阻止选中与拖拽 */
.ia-image { display: block; user-select: none; pointer-events: none; }
/* 点样式：小圆点，选中态高亮 */
.ia-dot { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: #ff4d4f; transform: translate(-50%, -50%); box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.35); cursor: grab; }
.ia-dot.selected { background: #40a9ff; box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.35); }
</style>

