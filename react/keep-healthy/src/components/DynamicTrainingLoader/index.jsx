import React, { Suspense, lazy, useState, useEffect } from 'react'
import styles from './DynamicLoader.module.css'

// 动态导入训练组件 - 实现代码分割
const ChestTraining = lazy(() => import('@/components/TrainingComponents/ChestTraining'))
const BackTraining = lazy(() => import('@/components/TrainingComponents/BackTraining'))
const GlutesTraining = lazy(() => import('@/components/TrainingComponents/GlutesTraining'))
const LegsTraining = lazy(() => import('@/components/TrainingComponents/LegsTraining'))
const DefaultTraining = lazy(() => import('@/components/TrainingComponents/DefaultTraining'))

// 组件映射表
const componentMap = {
  '胸': ChestTraining,
  '背': BackTraining,
  '臀': GlutesTraining,
  '腿': LegsTraining,
  '肩': DefaultTraining,
  '臂': DefaultTraining,
  '腹': DefaultTraining,
  '斜方肌': DefaultTraining,
  '二头': DefaultTraining,
  '三头': DefaultTraining,
  '肱二头': DefaultTraining,
  '肱三头': DefaultTraining,
  '肱四头': DefaultTraining,
  '肱五头': DefaultTraining,
  '肱六头': DefaultTraining,
}

// 加载状态组件
const LoadingComponent = ({ muscleName }) => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      <h3>正在加载{muscleName}训练内容...</h3>
      <p>精彩内容即将呈现 🎯</p>
    </div>
  </div>
)

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('训练组件加载错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>内容加载失败</h3>
            <p>抱歉，{this.props.muscleName}训练内容暂时无法加载</p>
            <button
              className={styles.retryButton}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              重试加载
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 主要的动态加载器组件
const DynamicTrainingLoader = ({ muscleName, onLoadStart, onLoadComplete }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 通知父组件开始加载
    onLoadStart && onLoadStart(muscleName)

    // 模拟加载时间（实际项目中这由懒加载自动处理）
    const timer = setTimeout(() => {
      setIsLoading(false)
      onLoadComplete && onLoadComplete(muscleName)
    }, 300)

    return () => clearTimeout(timer)
  }, [muscleName, onLoadStart, onLoadComplete])

  // 获取对应的组件
  const getTrainingComponent = () => {
    const Component = componentMap[muscleName] || DefaultTraining

    // 如果是默认组件，传入肌肉名称
    if (Component === DefaultTraining) {
      return <Component muscleName={muscleName} />
    }

    return <Component />
  }

  return (
    <div className={styles.dynamicContainer}>
      <ErrorBoundary muscleName={muscleName}>
        <Suspense fallback={<LoadingComponent muscleName={muscleName} />}>
          <div
            className={`${styles.contentWrapper} ${!isLoading ? styles.loaded : ''}`}
          >
            {getTrainingComponent()}
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default DynamicTrainingLoader