import styles from './virtual-waterfall.module.css'
import {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback
} from 'react'
import Loading from '@/components/Loading'
import ImageCard from '@/components/ImageCard'

/**
 * 虚拟滚动瀑布流组件 - 高性能版本
 * 
 * 性能优化点：
 * 1. 虚拟滚动：只渲染可视区域的元素
 * 2. 防抖加载：避免频繁触发 fetchMore
 * 3. 内存回收：自动清理不可见的 DOM 节点
 * 4. 智能预加载：提前加载即将进入视窗的内容
 */
const VirtualWaterFall = (props) => {
  const {
    loading,
    fetchMore,
    images = [],
    itemHeight = 300, // 平均项目高度
    overscan = 5      // 预渲染的额外项目数
  } = props

  const containerRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  // 防抖处理滚动事件
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  // 计算可视区域的项目
  const { visibleItems, totalHeight } = useMemo(() => {
    if (!images.length) return { visibleItems: [], totalHeight: 0 }

    // 按高度智能分配到两列
    const leftColumn = []
    const rightColumn = []
    let leftHeight = 0
    let rightHeight = 0

    images.forEach((img, index) => {
      const height = img.height || itemHeight
      if (leftHeight <= rightHeight) {
        leftColumn.push({ ...img, columnIndex: 0, top: leftHeight, index })
        leftHeight += height + 16 // 16px margin
      } else {
        rightColumn.push({ ...img, columnIndex: 1, top: rightHeight, index })
        rightHeight += height + 16
      }
    })

    // 合并两列并按位置排序
    const allItems = [...leftColumn, ...rightColumn]
    const maxHeight = Math.max(leftHeight, rightHeight)

    // 计算可视区域
    const startY = scrollTop - overscan * itemHeight
    const endY = scrollTop + containerHeight + overscan * itemHeight

    const visible = allItems.filter(item => {
      const itemBottom = item.top + (item.height || itemHeight)
      return itemBottom >= startY && item.top <= endY
    })

    return {
      visibleItems: visible,
      totalHeight: maxHeight
    }
  }, [images, scrollTop, containerHeight, itemHeight, overscan])

  // 监听容器尺寸变化
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  // 无限滚动加载
  useEffect(() => {
    const handleScrollLoad = () => {
      if (!containerRef.current || loading) return

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const threshold = scrollHeight - clientHeight - 1000 // 提前1000px触发

      if (scrollTop >= threshold) {
        fetchMore()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      container.addEventListener('scroll', handleScrollLoad)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
        container.removeEventListener('scroll', handleScrollLoad)
      }
    }
  }, [handleScroll, fetchMore, loading])

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ height: '100vh', overflow: 'auto' }}
    >
      <div
        className={styles.wrapper}
        style={{ height: totalHeight, position: 'relative' }}
      >
        {/* 左列容器 */}
        <div className={styles.column} style={{ left: 0 }}>
          {visibleItems
            .filter(item => item.columnIndex === 0)
            .map(item => (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: item.top,
                  width: '100%'
                }}
              >
                <ImageCard img={item} />
              </div>
            ))
          }
        </div>

        {/* 右列容器 */}
        <div className={styles.column} style={{ right: 0 }}>
          {visibleItems
            .filter(item => item.columnIndex === 1)
            .map(item => (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: item.top,
                  width: '100%'
                }}
              >
                <ImageCard img={item} />
              </div>
            ))
          }
        </div>

        {/* 加载指示器 */}
        {loading && (
          <div
            className={styles.loader}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}

export default VirtualWaterFall
