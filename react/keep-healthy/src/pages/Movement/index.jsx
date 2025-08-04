import React from 'react'
import styles from './Movement.module.css'
import Icon from '@/Icon'
import {
  useState
} from 'react'
import {
  Sidebar
} from 'react-vant'
import {
  Search
} from '@react-vant/icons'
import DynamicTrainingLoader from '@/components/DynamicTrainingLoader'

const tabs = [
  { name: '胸' },
  { name: '背' },
  { name: '臀' },
  { name: '腿' },
  { name: '肩' },
  { name: '臂' },
  { name: '腹' },
  { name: '斜方肌' },
  { name: '二头' },
  { name: '三头' },
  { name: '肱二头' },
  { name: '肱三头' },
  { name: '肱四头' },
  { name: '肱五头' },
  { name: '肱六头' },
]


const Movement = () => {
  const [active, setActive] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 处理加载开始
  const handleLoadStart = (muscleName) => {
    setIsLoading(true)
  }

  // 处理加载完成
  const handleLoadComplete = (muscleName) => {
    setIsLoading(false)
  }

  return (
    <div className={styles.movementContainer}>
      {/* 动作头部搜索栏 */}
      <div className={styles.searchContainer}>
        {/* 搜索框 */}
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="输入动作名字搜索"
            className={styles.searchInput}
          />
          {/* 添加动作图标 */}
          <div className={styles.addIcon}>
            <Icon type="icon-tianjia" size={24} />
          </div>
        </div>
      </div>
      {/* 主要内容区域 */}
      <div className={styles.mainContent}>
        {/* Sidebar 侧边导航栏 */}
        <Sidebar
          value={active}
          onChange={(key) => {
            setActive(key);

            // 使用动态组件加载，无需路由跳转
          }}
          className={styles.sidebar}
        >
          {tabs.map((tab, index) => (
            <Sidebar.Item
              key={index}
              title={tab.name}
            >
              {/* 侧边栏内容为空，内容在右侧动态显示 */}
            </Sidebar.Item>
          ))}
        </Sidebar>

        {/* 右侧动态内容区域 */}
        <div className={styles.contentArea}>
          <DynamicTrainingLoader
            muscleName={tabs[active]?.name || '胸'}
            onLoadStart={handleLoadStart}
            onLoadComplete={handleLoadComplete}
          />
        </div>
      </div>

    </div>
  )
}

export default Movement
