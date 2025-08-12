import styles from './waterfall.module.css'
import {
  useEffect,
  useRef,
  useMemo
} from 'react'
import Loading from '@/components/Loading'
import ImageCard from '@/components/ImageCard'

const WaterFall = (props) => {
  const loader = useRef(null)
  const {
    loading,
    fetchMore,
    images = [] // 设置默认值防止undefined错误
  } = props

  // 使用 useMemo 优化数组分割，避免每次渲染都重新计算
  const { leftColumn, rightColumn } = useMemo(() => {
    const left = []
    const right = []

    // 按高度分配到更短的列，实现更好的平衡
    let leftHeight = 0
    let rightHeight = 0

    images.forEach(img => {
      if (leftHeight <= rightHeight) {
        left.push(img)
        leftHeight += img.height || 200 // 使用实际高度或默认值
      } else {
        right.push(img)
        rightHeight += img.height || 200
      }
    })

    return { leftColumn: left, rightColumn: right }
  }, [images])

  // 使用自定义 Hook 优化 IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        fetchMore()
      }
    }, {
      rootMargin: '100px' // 提前触发加载
    })

    const currentLoader = loader.current
    if (currentLoader) {
      observer.observe(currentLoader)
    }

    // 清理函数防止内存泄漏
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader)
      }
      observer.disconnect()
    }
  }, [fetchMore, loading])


  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        {leftColumn.map(img => (
          <ImageCard key={img.id} img={img} />
        ))}
      </div>
      <div className={styles.column}>
        {rightColumn.map(img => (
          <ImageCard key={img.id} img={img} />
        ))}
      </div>
      <div ref={loader} className={styles.loader}>
        <Loading />
      </div>
    </div>
  )
}

export default WaterFall