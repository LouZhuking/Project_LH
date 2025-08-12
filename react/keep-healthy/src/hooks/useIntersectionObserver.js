import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useIntersectionObserver
 * 统一封装 IntersectionObserver，在目标元素进入视口时触发回调
 *
 * @param {(entry: IntersectionObserverEntry | { isIntersecting: boolean, target: Element }, observer: IntersectionObserver | null) => void} onIntersect
 *        目标进入视口时触发的回调。当浏览器不支持 IntersectionObserver 时，会降级立即触发一次，
 *        并以 { isIntersecting: true, target: element } 的形式提供简化 entry。
 * @param {Object} options - 观察配置
 * @param {Element|null} [options.root=null] - 根容器
 * @param {string} [options.rootMargin='0px'] - 触发边距
 * @param {number|number[]} [options.threshold=0] - 触发阈值
 * @param {boolean} [options.once=false] - 是否仅触发一次（触发后自动取消观察）
 * @param {boolean} [options.disabled=false] - 是否禁用观察
 * @param {React.RefObject<Element>|null} [options.target=null] - 外部传入的目标 Ref（可选）。若不传则返回内部 ref 供绑定。
 *
 * @returns {{
 *   ref: React.RefCallback<Element> | React.RefObject<Element>,
 *   isIntersecting: boolean,
 *   entry: IntersectionObserverEntry | null,
 *   observe: (node: Element) => void,
 *   unobserve: (node: Element) => void,
 *   stop: () => void,
 *   resume: () => void
 * }}
 */
function useIntersectionObserver(onIntersect, options = {}) {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    once = false,
    disabled = false,
    target: externalRef = null,
  } = options

  const internalRef = useRef(null)
  const targetRef = externalRef || internalRef

  const observerRef = useRef(null)
  const [entry, setEntry] = useState(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  const cleanupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  const createObserver = useCallback(() => {
    if (disabled) return

    // SSR 或 非浏览器环境
    if (typeof window === 'undefined') return

    const element = targetRef.current
    if (!element) return

    // 兼容性降级：不支持 IntersectionObserver 时，直接触发一次回调
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true)
      if (typeof onIntersect === 'function') {
        onIntersect({ isIntersecting: true, target: element }, null)
      }
      return
    }

    cleanupObserver()

    const observer = new IntersectionObserver((entries, obs) => {
      const firstEntry = entries[0]
      setEntry(firstEntry)
      const nowIntersecting = Boolean(firstEntry && firstEntry.isIntersecting)
      setIsIntersecting(nowIntersecting)

      if (nowIntersecting && typeof onIntersect === 'function') {
        onIntersect(firstEntry, obs)
      }

      if (nowIntersecting && once && element) {
        obs.unobserve(element)
      }
    }, { root, rootMargin, threshold })

    observerRef.current = observer
    observer.observe(element)
  }, [cleanupObserver, disabled, onIntersect, root, rootMargin, targetRef, threshold, once])

  useEffect(() => {
    createObserver()
    return cleanupObserver
  }, [createObserver, cleanupObserver])

  const refCallback = useCallback((node) => {
    if (!externalRef) {
      internalRef.current = node
    }
    // 目标节点变化时重建观察
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (node) {
      // 延迟到下一个宏任务，确保 DOM 就绪
      Promise.resolve().then(() => createObserver())
    }
  }, [createObserver, externalRef])

  const observe = useCallback((node) => {
    if (!node) return
    if (!observerRef.current) {
      createObserver()
    }
    if (observerRef.current) {
      observerRef.current.observe(node)
    }
  }, [createObserver])

  const unobserve = useCallback((node) => {
    if (observerRef.current && node) {
      observerRef.current.unobserve(node)
    }
  }, [])

  const stop = useCallback(() => {
    cleanupObserver()
  }, [cleanupObserver])

  const resume = useCallback(() => {
    createObserver()
  }, [createObserver])

  return {
    ref: externalRef ? externalRef : refCallback,
    isIntersecting,
    entry,
    observe,
    unobserve,
    stop,
    resume,
  }
}

export default useIntersectionObserver


