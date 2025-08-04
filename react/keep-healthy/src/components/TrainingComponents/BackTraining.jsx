import React from 'react'
import styles from './TrainingStyles.module.css'

const BackTraining = () => {
  const exercises = [
    {
      id: 1,
      name: '引体向上',
      description: '锻炼背阔肌和肱二头肌的经典动作',
      sets: '3组',
      reps: '8-12次',
      difficulty: '高级',
      tips: '全程控制，避免摆动身体'
    },
    {
      id: 2,
      name: '坐姿划船',
      description: '使用器械进行背部肌肉训练',
      sets: '4组',
      reps: '10-15次',
      difficulty: '中级',
      tips: '收紧肩胛骨，感受背部发力'
    },
    {
      id: 3,
      name: '硬拉',
      description: '全身性复合动作，重点锻炼下背部',
      sets: '3组',
      reps: '6-8次',
      difficulty: '高级',
      tips: '保持背部挺直，臀部发力'
    }
  ]

  return (
    <div className={styles.trainingContainer}>
      <div className={styles.header}>
        <h2>🏋️ 背部训练</h2>
        <p>塑造强劲的背部线条，改善体态</p>
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

export default BackTraining