import React from 'react'
import styles from './TrainingStyles.module.css'

const LegsTraining = () => {
  const exercises = [
    {
      id: 1,
      name: '腿举',
      description: '使用器械进行大腿前侧肌群训练',
      sets: '4组',
      reps: '12-15次',
      difficulty: '中级',
      tips: '控制重量下降，避免膝盖内扣'
    },
    {
      id: 2,
      name: '腿弯举',
      description: '孤立训练大腿后侧腘绳肌',
      sets: '3组',
      reps: '12-15次',
      difficulty: '中级',
      tips: '动作缓慢，顶峰收缩'
    },
    {
      id: 3,
      name: '提踵',
      description: '训练小腿肌群，塑造小腿线条',
      sets: '4组',
      reps: '15-20次',
      difficulty: '初级',
      tips: '充分伸展，感受小腿肌肉收缩'
    }
  ]

  return (
    <div className={styles.trainingContainer}>
      <div className={styles.header}>
        <h2>🦵 腿部训练</h2>
        <p>强化下肢力量，打造结实大腿</p>
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

export default LegsTraining