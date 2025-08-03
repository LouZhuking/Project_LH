import React from 'react'
import SearchBox from '@/components/SearchBox'
import useSearchStore from '@/store/useSearchStore'
import styles from './search.module.css'
import {
  useState,
  useEffect
} from 'react'
import {
  Swiper,
  Image
} from 'react-vant'
import HotListItems from '@/components/HotListItems'
import Icon from '@/Icon'
import { images } from '@/images/Search'

const Search = () => {
  const [query, setQuery] = useState('')

  const {
    suggestList,
    setSuggestList,
    hotList,
    setHotList
  } = useSearchStore()

  useEffect(() => {
    setHotList();
  }, [])


  // 单向数据流
  // 反复生成 useCallback
  const handleQuery = (query) => {
    // api 请求
    // console.log('debounce后', query);
    setQuery(query)
    if (!query) {
      return;
    }
    setSuggestList(query)
  }

  const suggestListStyle = {
    display: query == "" ? 'none' : 'block'
  }


  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SearchBox handleQuery={handleQuery} />
        {/* 搜索记录栏 */}
        <div className={styles.searchRecord}>
          <div className={styles.searchRecordLeft}>
            <span>搜索记录</span>
          </div>
          <div className={styles.searchRecordRight}>
            {/* 清楚按钮 */}
            <Icon type="icon-icon" size={15} />
            <span>清除</span>
          </div>
        </div>
        {/* 记录内容 */}
        <div className={styles.searchRecordContent}>
          <div className={styles.searchRecordItem}>
            <a className={styles.searchRecordTitle} href='/'>人猿泰山锻炼法</a>
            <a className={styles.searchRecordTitle} href='/'>人猿泰山锻炼法</a>
            <a className={styles.searchRecordTitle} href='/'>人猿泰山锻炼法</a>
            <a className={styles.searchRecordTitle} href='/'>人猿锻炼法</a>
            <a className={styles.searchRecordTitle} href='/'>人猿泰山法</a>
            <a className={styles.searchRecordTitle} href='/'>人猿锻炼法</a>
            <a className={styles.searchRecordTitle} href='/'>泰山法</a>
          </div>
        </div>
        {/* 热门推荐 */}
        <HotListItems hotList={hotList} />
        {/* 搜索建议搜索当中自动弹出 */}
        <div className={styles.list} style={suggestListStyle}>
          {
            suggestList.map(item => (
              <div key={item} className={styles.item}>
                {item}
              </div>
            ))
          }
        </div>
        {/* 热门建议轮播图 */}
        <div className={styles.swiper}>
          <Swiper pagination={false} autoplay={3000}>
            {images.map((image) => (
              <Swiper.Item key={image}>
                <Image src={image} />
              </Swiper.Item>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default Search