import styles from './PropertyCard.module.css'

// 物件情報を表示するカードコンポーネント
export default function PropertyCard({ property }) {
  const { name, rent, area, size, type } = property

  return (
    <div className={styles.card}>
      <div className={styles.typeTag}>{type}</div>
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.rent}>
        <span className={styles.rentAmount}>{rent.toLocaleString()}</span>
        <span className={styles.rentUnit}>円 / 月</span>
      </div>
      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>エリア</span>
          <span className={styles.detailValue}>{area}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>面積</span>
          <span className={styles.detailValue}>{size}</span>
        </div>
      </div>
    </div>
  )
}
