import styles from './HotListItems.module.css'


const HotListItems = (props) => {
  console.log('-----', props);
  const { hotList } = props
  return (
    <div className={styles.hot}>
      <div className={styles.hotTitle}>
        <p>热门推荐</p>
      </div>
      <div className={styles.hotList}>
        {
          hotList.map((item) => (
            <div key={item.id} className={styles.item}>
              {item.title}
            </div>
          ))
        }
      </div>
    </div>

  )
}

export default HotListItems