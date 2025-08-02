import styles from './waterfall.module.css'
import {
  useEffect,
  useRef
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

  // console.log(images); 
  // 如何判断ref 出现在视窗了
  // 观察者模式   intersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        fetchMore()
      }
      // obs.unobserve(entry.target)
    })
    if (loader.current) observer.observe(loader.current)
  }, [fetchMore])


  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        {
          images.filter((_, i) => i % 2 === 0).map(img => (
            <ImageCard key={img.id} img={img} />
          ))
        }
      </div>
      <div className={styles.column}>
        {
          images.filter((_, i) => i % 2 !== 0).map(img => (
            <ImageCard key={img.id} img={img} />
          ))
        }
      </div>
      <div ref={loader} className={styles.loader}>
        <Loading />
      </div>
    </div>
  )
}

export default WaterFall