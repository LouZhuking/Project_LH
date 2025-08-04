import React from 'react'
import styles from './TrainingStyles.module.css'

const ChestTraining = () => {
  const exercises = [
    {
      id: 1,
      name: '俯卧撑',
      description: '基础胸部训练动作，锻炼整个胸肌群',
      sets: '3组',
      reps: '10-15次',
      difficulty: '初级',
      tips: '保持身体直线，胸部充分下沉'
    },
    {
      id: 2,
      name: '卧推',
      description: '使用杠铃或哑铃进行胸部力量训练',
      sets: '4组',
      reps: '8-12次',
      difficulty: '中级',
      tips: '控制节奏，顶峰收缩'
    },
    {
      id: 3,
      name: '夹胸器夹胸',
      description: '孤立性胸肌训练，雕刻胸肌线条',
      sets: '3组',
      reps: '12-15次',
      difficulty: '中级',
      tips: '动作缓慢，感受肌肉收缩'
    }
  ]

  return (
    <div className={styles.trainingContainer}>
      <div className={styles.header}>
        <h2>💪 胸部训练</h2>
        <p>打造强壮的胸肌，提升上身力量</p>
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

export default ChestTraining