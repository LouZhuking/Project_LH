# 图像标注（多点锚定，拖拽/缩放不漂移）

> 参考视频：`1ac18b10fb23c07a245c9017dd0ecfb8.mp4`（效果为：在一张背景图上标注多个点，支持拖拽平移与缩放，点相对图片位置保持不变）

## 目标与背景

- 在一张背景图片上标注多个点，点可新增、选择、拖动、删除。
- 支持图片的拖拽平移与缩放（滚轮/触控缩放），缩放中心跟随指针位置，保证“点相对图片的坐标不发生漂移”。
- 窗口尺寸变化、图片自适应布局下，点仍严格锚定在图片内容对应位置。
- 提供标注数据的导入/导出能力（JSON）。

---

## 需求清单（必备）

- 多点标注：
  - 新增点：点击图片可新增一个点。
  - 移动点：拖动已存在的点，更新其在图片坐标系中的位置。
  - 删除点：支持选中后删除（或右键菜单/按键删除）。
- 画布交互：
  - 拖拽平移：按住空白区域拖拽移动图片视图。
  - 滚轮缩放：以鼠标位置为缩放中心进行放大/缩小；触摸屏支持双指捏合缩放。
  - 缩放范围：默认限制在 [0.2, 5]。
- 坐标稳定：
  - 点的存储使用图片原始坐标系（建议百分比 0~1），与屏幕分辨率无关。
  - 任意拖拽/缩放/窗口变更后，点仍映射到图片的正确位置。
- 数据管理：
  - 导出：导出为 JSON（含图片标识、点位列表、备注等）。
  - 导入：从 JSON 恢复到画布。
- 基础可用性：
  - 性能流畅（拖拽与缩放使用 transform，事件节流/合并更新）。
  - 可选键盘辅助（如 Delete 删除点，Esc 取消选择）。

---

## 用户操作流程（步骤）

1. 打开页面，加载背景图片（自动读取图片原始宽高）。
2. 初始化画布：图片以“原始尺寸舞台 + 视口变换”的方式呈现。
3. 新增点：用户点击图片内容区域，新增一个点（默认居中小圆点），并保存为百分比坐标（xPct, yPct）。
4. 拖动点：
   - 按下点进行拖拽，在拖拽过程中实时更新点在图片坐标系中的百分比位置。
   - 松开后固化位置。
5. 拖拽平移：
   - 按住空白画布拖动，更新平移量 translateX/translateY。
6. 滚轮缩放：
   - 滚轮向上放大、向下缩小；缩放中心为当前指针位置，保持指针所指图片内容不发生跳动。
7. 导出/导入：
   - 通过按钮导出当前标注为 JSON；支持从 JSON 导入恢复。

---

## 技术方案与关键计算

### 核心思想

- 使用“舞台坐标系”固定不变来摆放图片与点（舞台大小 = 图片原始宽高）。
- 对舞台整体应用变换：`transform: translate(tx, ty) scale(s)` 来实现拖拽和平移。
- 点以“图片原始坐标”或“百分比坐标”存储与渲染：
  - 存储：`xPct = x / naturalWidth`, `yPct = y / naturalHeight`。
  - 渲染：`left = xPct * naturalWidth`, `top = yPct * naturalHeight`。
- 因为图片与点都放在同一个“舞台”里并共享同一个 transform，所以缩放和平移时，点会与图片一起同步变换，不会产生相对漂移。

### 关键变量

- 图片原始尺寸：`naturalWidth`, `naturalHeight`
- 舞台（未变换前）尺寸：与图片原始尺寸相同
- 变换状态：`scale = s`, `translateX = tx`, `translateY = ty`
- 点的存储：`{ id, xPct, yPct, meta? }`

### 事件与数学公式

- 拖拽平移：
  - 在指针移动时更新平移量：`tx += deltaX`, `ty += deltaY`
- 以指针为中心缩放（保持指针锚定的图片内容不动）：
  - 设屏幕指针位置为 `(cx, cy)`（相对容器左上角），缩放前的局部坐标：
    - `localX = (cx - tx) / s`
    - `localY = (cy - ty) / s`
  - 缩放后 `s' = clamp(s * zoomFactor, minScale, maxScale)`，为保持该局部点在屏幕位置不动，更新：
    - `tx' = cx - localX * s'`
    - `ty' = cy - localY * s'`
- 点在舞台坐标（像素）：
  - `x = xPct * naturalWidth`, `y = yPct * naturalHeight`

### 自适应与边界

- 容器尺寸变化不影响舞台坐标；仅影响可见区域。
- 可选：限制平移边界，使舞台始终至少覆盖容器可见区域（按需实现）。

### 性能建议

- 拖拽/缩放时用 `requestAnimationFrame` 合并刷新。
- 使用 `transform: translate3d(...) scale(...)` 开启 GPU 加速。
- 事件使用 `passive: true`（滚轮除外）提升滚动性能。

---

## 数据结构示例

```json
{
  "image": {
    "id": "bg-001",
    "url": "/path/to/image.jpg",
    "naturalWidth": 1920,
    "naturalHeight": 1080
  },
  "points": [
    { "id": "p1", "xPct": 0.25, "yPct": 0.33, "meta": { "label": "A" } },
    { "id": "p2", "xPct": 0.68, "yPct": 0.72, "meta": { "label": "B" } }
  ]
}
```

---

## Vue 3 最小示例（核心思路）

> 仅示意关键交互与数学计算；实际项目请拆分为组件、指令与 hooks，并补充完整的样式与异常处理。

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 舞台变换状态（中文逐行注释）
const scale = ref(1) // 当前缩放倍数
const translateX = ref(0) // 当前 X 方向平移
const translateY = ref(0) // 当前 Y 方向平移
const minScale = 0.2 // 最小缩放
const maxScale = 5 // 最大缩放

// 图片原始尺寸（通常在图片 onload 后得到）
const naturalWidth = ref(1920)
const naturalHeight = ref(1080)

// 点数据：使用百分比坐标存储，渲染时换算为舞台像素
const points = ref<{ id: string; xPct: number; yPct: number }[]>([])

// 容器引用
const containerRef = ref<HTMLElement | null>(null)

// 将屏幕指针坐标转为缩放前的舞台局部坐标
function toLocal(cx: number, cy: number) {
  const s = scale.value
  const tx = translateX.value
  const ty = translateY.value
  return {
    x: (cx - tx) / s,
    y: (cy - ty) / s,
  }
}

// 以指针为中心缩放
function zoomAt(cx: number, cy: number, factor: number) {
  const before = toLocal(cx, cy)
  const next = Math.min(maxScale, Math.max(minScale, scale.value * factor))
  scale.value = next
  translateX.value = cx - before.x * next
  translateY.value = cy - before.y * next
}

// 处理滚轮缩放
function onWheel(e: WheelEvent) {
  e.preventDefault()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top
  const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
  zoomAt(cx, cy, factor)
}

// 在空白处点击新增一个点
function onContainerClick(e: MouseEvent) {
  if (!(e.currentTarget instanceof HTMLElement)) return
  const rect = e.currentTarget.getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top
  const local = toLocal(cx, cy)

  const xPct = local.x / naturalWidth.value
  const yPct = local.y / naturalHeight.value

  // 约束在 0~1
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  points.value.push({ id: Math.random().toString(36).slice(2), xPct: clamp(xPct), yPct: clamp(yPct) })
}

// 拖拽平移（按住空白区域拖动）
let dragging = false
let lastX = 0
let lastY = 0

function onPointerDown(e: PointerEvent) {
  if (!(e.currentTarget instanceof HTMLElement)) return
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  translateX.value += dx
  translateY.value += dy
  lastX = e.clientX
  lastY = e.clientY
}

function onPointerUp(e: PointerEvent) {
  dragging = false
}

onMounted(() => {
  // 实际中 naturalWidth/naturalHeight 来自图片 onload
})
</script>

<template>
  <div
    ref="containerRef"
    class="container"
    @wheel.passive.prevent="onWheel"
    @click="onContainerClick"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <div
      class="stage"
      :style="{
        width: naturalWidth + 'px',
        height: naturalHeight + 'px',
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        transformOrigin: '0 0'
      }"
    >
      <!-- 背景图（等比渲染为原始尺寸） -->
      <img class="bg" src="/your-image.jpg" :width="naturalWidth" :height="naturalHeight" />

      <!-- 点（基于舞台像素定位） -->
      <div
        v-for="p in points"
        :key="p.id"
        class="dot"
        :style="{ left: (p.xPct * naturalWidth) + 'px', top: (p.yPct * naturalHeight) + 'px' }"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #111;
}
.stage {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
}
.bg {
  display: block;
  user-select: none;
  pointer-events: none; /* 让空白区域事件落到容器上 */
}
.dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4d4f;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.3);
}
</style>
```

---

## 使用说明（本项目）

- 启动开发：
  - `pnpm i` / `npm i`
  - `pnpm dev` / `npm run dev`
- 将上述组件思想集成到 `src/App.vue` 或新建组件中；建议封装为 `ImageAnnotator` 组件，暴露 `points`、`onAdd`、`onChange`、`onDelete` 等 props/emits。

---

## 关键点说明（可粘贴到 PR/提交说明）

- 变更摘要：
  - 本次编辑的文件与范围：`WebFront/drag-picture/README.md`
  - 新增能力/修复问题：给出多点标注在拖拽/缩放下不漂移的完整方案与实现要点。
- 设计考量：
  - 为什么这样做：将图片与点放入同一“原始尺寸舞台”，对舞台做统一变换，避免逐点重算，保证数值稳定性与实现简洁性。
  - 替代方案对比：
    - 方案A（本方案）：舞台统一 `translate+scale`，点用原始坐标/百分比，简单稳定；
    - 方案B：基于 `getBoundingClientRect` 每帧换算点位置，逻辑复杂且易受布局影响；
    - 方案C：Canvas 绘制，性能好但编辑交互复杂，后期扩展成本高。
  - 对性能/安全/可维护性的影响：
    - 性能：transform+GPU 加速、rAF 合并更新；
    - 安全：无敏感信息，不持久化隐私数据；
    - 可维护：坐标体系清晰、与分辨率解耦。
- 使用说明：
  - 参见“使用说明（本项目）”，以及示例代码片段。
- 配置与环境变量：
  - 无新增配置。
- 兼容与风险：
  - 与旧逻辑的兼容策略：仅文档与方案，无破坏性变更；
  - 潜在风险与回滚计划：若后续实现与方案不一致导致漂移，可回滚为文档版本并按方案修正实现。
- 测试要点：
  - 详见下文“测试要点”。

---

## Diff 评审清单

- 是否遵循最小改动面？是（仅 README 文档）。
- 是否破坏对外 API/契约？否。
- 是否引入新依赖或全局副作用？否。
- 是否有充分的错误处理与日志？（本文档为设计层面，实际实现需补充异常与日志）。
- 是否补充/更新了测试？（本文档给出测试要点）。

---

## 安全与合规提示

- 禁止在代码中写死 Token/密钥/个人信息。
- 外部输入（导入 JSON）需做校验与清理，防止 XSS/原型污染。
- 文件路径与命令执行需做白名单或隔离（本方案未涉及）。
- 前端对隐私数据最小化持久化与传输加密（本方案未持久化隐私）。

---

## 测试要点

- 缩放锚定：鼠标指针处内容在缩放前后应保持在同一屏幕位置。
- 点稳定性：
  - 连续多次缩放/拖拽后，点仍锚定在正确的图片内容上。
  - 刷新窗口大小后，点位置仍正确。
- 编辑能力：新增/拖动/删除点的行为正确，百分比坐标在 0~1 范围内。
- 数据导入/导出：导出 JSON 再导入，画布状态应完全还原。
- 极端场景：
  - 极小/极大缩放边界下，无数值抖动与跳变。
  - 快速拖拽与高频滚轮缩放下，帧率与交互稳定。
- 触摸支持（如有）：双指捏合缩放，单指拖动平移，行为与鼠标一致。

---

## 回滚与风险

- 本次提交仅文档，不影响运行时逻辑。若后续实现与文档不符导致问题，可回滚实现代码，按本文方案逐项校正。

---

## 变更记录

- 2025-09-21：新增 README，完善需求、流程与技术方案。 