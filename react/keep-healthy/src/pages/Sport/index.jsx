import { useState } from 'react'
import styles from './sport.module.css'

const Sport = () => {
  const [selectedMode, setSelectedMode] = useState(0)
  const [targetDistance, setTargetDistance] = useState(10.00)
  const [selectedType, setSelectedType] = useState(0)

  // 运动模式选项
  const sportModes = [
    { icon: '🏃', name: '户外跑步' },
    { icon: '🚶', name: '户外行走' },
    { icon: '🦘', name: '跳绳' },
    { icon: '🏊', name: '游泳' }
  ]

  // 运动类型选项
  const runTypes = ['目标跑', '自由跑', '课程跑']

  // 调整目标距离
  const adjustDistance = (direction) => {
    if (direction === 'prev') {
      setTargetDistance(prev => Math.max(1, prev - 1))
    } else {
      setTargetDistance(prev => prev + 1)
    }
  }

  return (
    <div className={styles.sportContainer}>
      {/* 顶部导航栏 */}
      <div className={styles.topNavBar}>
        <div className={styles.leftSection}>
          <span className={styles.lightningIcon}>⚡</span>
          <span className={styles.scoreText}>0</span>
        </div>

        <div className={styles.centerSection}>
          <div className={styles.upgradeButton}>
            <span className={styles.upgradeIcon}>💎</span>
            <span className={styles.upgradeText}>升级</span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.userIcon}>👥</div>
          <div className={styles.settingsIcon}>⚙️</div>
        </div>
      </div>

      {/* 顶部运动模式选择栏 */}
      <div className={styles.sportModesContainer}>
        <div className={styles.allModes}>
          <div className={styles.gridIcon}>⊞</div>
        </div>
        {sportModes.map((mode, index) => (
          <div
            key={index}
            className={`${styles.modeItem} ${selectedMode === index ? styles.activeModeItem : ''}`}
            onClick={() => setSelectedMode(index)}
          >
            <span className={styles.modeIcon}>{mode.icon}</span>
            <span className={styles.modeName}>{mode.name}</span>
          </div>
        ))}
      </div>

      {/* 主要内容区域 */}
      <div className={styles.mainContent}>
        {/* 目标距离卡片 */}
        <div className={styles.targetCard}>
          <div className={styles.targetHeader}>
            <button
              className={styles.navButton}
              onClick={() => adjustDistance('prev')}
            >
              ‹
            </button>
            <span className={styles.targetTitle}>目标距离</span>
            <button
              className={styles.navButton}
              onClick={() => adjustDistance('next')}
            >
              ›
            </button>
          </div>

          <div className={styles.distanceDisplay}>
            {targetDistance.toFixed(2)}
          </div>

          <div className={styles.unitText}>
            点击设置 (公里)
          </div>

          {/* GPS状态和心率显示 */}
          <div className={styles.statusIcons}>
            <div className={styles.heartRate}>
              <span className={styles.heartIcon}>♡</span>
              <span>--</span>
            </div>
            <div className={styles.gpsStatus}>
              <span>GPS</span>
              <div className={styles.gpsIndicator}></div>
            </div>
          </div>
        </div>

        {/* 运动类型选择 */}
        <div className={styles.runTypesContainer}>
          {runTypes.map((type, index) => (
            <div
              key={index}
              className={`${styles.runTypeItem} ${selectedType === index ? styles.activeRunType : ''}`}
              onClick={() => setSelectedType(index)}
            >
              {type}
            </div>
          ))}
        </div>

        {/* 底部操作区域 */}
        <div className={styles.bottomActions}>
          <button className={styles.goButton}>
            GO
          </button>
          <div className={styles.equipmentButton}>
            <span className={styles.equipmentIcon}>⚙</span>
            <span>装备</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sport