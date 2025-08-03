import React from 'react'
import styles from './Movement.module.css'
import Icon from '@/Icon'
import {
  useState
} from 'react'
import {
  Sidebar,
  Toast
} from 'react-vant'
import {
  Search
} from '@react-vant/icons'

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
      {/* Sidebar 侧边导航栏 */}
      <Sidebar
        value={active}
        onChange={(key) => {
          setActive(key);
          Toast.info(`内容区 ${key + 1}`);
          // 路由跳转页面 如何搞？？？
        }}
        className={styles.sidebar}
      >
        {tabs.map((key, index) => (
          <Sidebar.Item
            key={index}
            contentStyle={{ backgroundColor: '#fff', padding: '18px 10px' }}
            title={key.name}
          >
            {key.name}
          </Sidebar.Item>
        ))}
      </Sidebar>

    </div>
  )
}

export default Movement
