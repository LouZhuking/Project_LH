import styles from './loading.module.css'
import {
  memo
} from 'react'

const Loading = () => {
  return (
    <div className={styles.boxLoading}>
    </div>
  )
}

export default memo(Loading)
