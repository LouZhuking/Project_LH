import {
  useState,
  useEffect
} from 'react'
import {
  Search,
  UserO,
  SettingO
} from '@react-vant/icons'
import {
  useNavigate
} from 'react-router-dom'
import {
  useImageStore
} from '@/store/useImageStore'
import useTitle from '@/hooks/useTitle'
import styles from './home.module.css'
import WaterFall from '@/components/WaterFall'

const Home = () => {
  useTitle('首页')
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(1) // 默认选中"推荐"
  const {
    images,
    loading,
    fetchMore
  } = useImageStore()
  // console.log(images);

  // 组件挂载时自动加载第一页数据
  useEffect(() => {
    if (images.length === 0) {
      fetchMore()
    }
  }, [fetchMore, images.length])

  const navTabs = ['社区', '推荐', '课程', '计划', '奖牌', '比赛', '...']
  const contentTags = ['大体重减脂', '躺床练', '晒奖牌', '八段锦', '减脂']

  return (
    <div className={styles.homeContainer}>
      {/* 顶部导航栏 */}
      <div className={styles.topHeader}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox} onClick={() => navigate('/search')}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="库洛米奖牌"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.headerIcons}>
            <UserO className={styles.headerIcon} />
            <div className={styles.messageContainer}>
              <SettingO className={styles.headerIcon_setting} />
              <span className={styles.badge}>99+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className={styles.tabContainer}>
        <div className={styles.tabList}>
          {navTabs.map((tab, index) => (
            <div
              key={index}
              className={`${styles.tabItem} ${activeTab === index ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* 内容标签 */}
      <div className={styles.contentTags}>
        {contentTags.map((tag, index) => (
          <div key={index} className={styles.tagButton}>
            {tag}
          </div>
        ))}
      </div>

      {/* 瀑布流 */}
      <div className={styles.waterfallArea}>
        <WaterFall
          images={images}
          loading={loading}
          fetchMore={fetchMore}
        />
      </div>
    </div>
  )
}

export default Home