import {
  memo,
  useRef,
  useState,
  useEffect,
  useMemo
} from 'react'
import {
  debounce
} from '@/utils'
import {
  ArrowLeft,
  Close
} from '@react-vant/icons'
import {
  useNavigate
} from 'react-router-dom'
import styles from './search.module.css'

const SearchBox = (props) => {
  // api 
  // 单项数据流
  // 子父通信
  const [query, setQuery] = useState("");

  const queryRef = useRef(null)

  const { handleQuery } = props
  // 非受控组件


  const navigate = useNavigate()

  const handleChange = (e) => {
    let val = e.currentTarget.value
    setQuery(val)
  }

  const clearQuery = () => {
    setQuery("");
    // 找到DOM节点元素清空
    queryRef.current.value = "";
    // 当清楚之后再次聚焦于输入框
    queryRef.current.focus();
  }

  // 1. 防抖
  // 2. useMemo 缓存debounce结果 否则会反复执行
  const handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 300)
  }, [])

  const displayStyle = query ? { display: "block" } : { display: "none" }

  useEffect(() => {
    // console.log(query, '//////');

    // 防抖
    handleQueryDebounce(query)
  }, [query])



  return (
    <div className={styles.wrapper}>
      <ArrowLeft onClick={() => navigate(-1)} />
      <input
        type="text"
        className={styles.ipt}
        placeholder='搜索健身相关的'
        ref={queryRef}
        onChange={handleChange}
      />
      {/* 移动端用户体验 */}
      <Close onClick={clearQuery} style={displayStyle} />
    </div>
  )
}


export default memo(SearchBox)