import React from 'react'
import styles from './TrainingStyles.module.css'

const DefaultTraining = ({ muscleName }) => {
  return (
    <div className={styles.trainingContainer}>
      <div className={styles.header}>
        <h2>🏃‍♂️ {muscleName}训练</h2>
        <p>该部位的训练内容正在开发中，敬请期待！</p>
      </div>

      <div className={styles.comingSoon}>
        <div className={styles.comingSoonCard}>
          <div className={styles.comingSoonIcon}>🚧</div>
          <h3>内容开发中</h3>
          <p>我们正在为您准备专业的{muscleName}训练内容</p>
          <p>包含：</p>
          <ul className={styles.featureList}>
            <li>✨ 专业训练动作指导</li>
            <li>📊 个性化训练计划</li>
            <li>📹 高清动作示范视频</li>
            <li>📈 训练进度追踪</li>
          </ul>
          <button className={styles.notifyButton}>通知我上线</button>
        </div>
      </div>
    </div>
  )
}

export default DefaultTraining