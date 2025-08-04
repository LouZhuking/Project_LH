import React from 'react'
import styles from './TrainingStyles.module.css'

const GlutesTraining = () => {
  const exercises = [
    {
      id: 1,
      name: '深蹲',
      description: '全身性训练动作，重点锻炼臀大肌',
      sets: '4组',
      reps: '12-15次',
      difficulty: '初级',
      tips: '膝盖与脚尖同向，下蹲至大腿平行地面'
    },
    {
      id: 2,
      name: '臀桥',
      description: '孤立性臀部训练，激活臀大肌',
      sets: '3组',
      reps: '15-20次',
      difficulty: '初级',
      tips: '顶峰收缩2秒，感受臀部发力'
    },
    {
      id: 3,
      name: '保加利亚分腿蹲',
      description: '单腿训练，提高臀部力量和稳定性',
      sets: '3组',
      reps: '10-12次/腿',
      difficulty: '中级',
      tips: '重心在前腿，控制下降速度'
    }
  ]

  return (
    <div className={styles.trainingContainer}>
      <div className={styles.header}>
        <h2>🍑 臀部训练</h2>
        <p>塑造紧致臀线，提升下肢力量</p>
      </div>

      <div className={styles.exerciseGrid}>
        {exercises.map(exercise => (
          <div key={exercise.id} className={styles.exerciseCard}>
            <div className={styles.exerciseHeader}>
              <h3>{exercise.name}</h3>
              <span className={`${styles.difficulty} ${styles[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
            </div>

            <p className={styles.description}>{exercise.description}</p>

            <div className={styles.exerciseDetails}>
              <div className={styles.detail}>
                <strong>组数:</strong> {exercise.sets}
              </div>
              <div className={styles.detail}>
                <strong>次数:</strong> {exercise.reps}
              </div>
            </div>

            <div className={styles.tips}>
              <strong>💡 训练要点:</strong> {exercise.tips}
            </div>

            <button className={styles.startButton}>开始训练</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GlutesTraining