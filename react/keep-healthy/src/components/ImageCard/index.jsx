import styles from './card.module.css'
import {
  memo,
  useMemo
} from 'react'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'

const ImageCard = (props) => {
  // console.log(props);
  const { img } = props
  const { url, height } = img
  // console.log(img);
  const detailFallback = [
    { title: '标题示例', desc: '这是一段用于展示的描述文本，用以占位说明内容。' },
    { title: '探索灵感', desc: '灵感来源于生活，通过记录捕捉每一个美好瞬间。' },
    { title: '日常记录', desc: '轻松记录你的生活点滴，发现日常中的不平凡。' },
  ]

  // 使用 useMemo 固定随机选择的标题和描述，避免重新渲染时刷新
  const { title, desc } = useMemo(() => {
    if (img.title && img.desc) {
      return { title: img.title, desc: img.desc }
    }
    const randomItem = detailFallback[Math.floor(Math.random() * detailFallback.length)]
    return {
      title: img.title || randomItem.title,
      desc: img.desc || randomItem.desc
    }
  }, [img.title, img.desc])

  const { ref } = useIntersectionObserver((entry, obs) => {
    if (!entry || !entry.isIntersecting) return
    const targetImg = entry.target
    const preloader = document.createElement('img')
    preloader.src = targetImg.dataset.src
    preloader.onload = () => {
      // 确保图片已经预加载完成，然后平滑切换
      targetImg.src = preloader.src
      // 使用 setTimeout 确保 src 更新后再显示
      setTimeout(() => {
        targetImg.style.opacity = '1'
      }, 16) // 一帧的时间
    }
    preloader.onerror = () => {
      // 图片加载失败时也显示，避免一直隐藏
      targetImg.style.opacity = '1'
    }
    if (obs) obs.unobserve(targetImg)
  }, { rootMargin: '50px', once: true })

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper} style={{ height }}>
        <img ref={ref} data-src={url} className={styles.img} />
      </div>
      <div className={styles.detail}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
    </div>
  )
}

export default memo(ImageCard)