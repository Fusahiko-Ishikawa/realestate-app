import styles from './PropertyCard.module.css'

// 物件情報を表示するカードコンポーネント
// onEdit / onDelete は親（Properties.jsx）から渡されるコールバック
export default function PropertyCard({ property, onEdit, onDelete }) {
  const { name, rent, area, floor_plan } = property

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.typeTag}>{floor_plan}</div>
        <div className={styles.cardActions}>
          <button
            className={styles.editButton}
            onClick={() => onEdit(property)}
            aria-label="編集"
          >
            編集
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(property)}
            aria-label="削除"
          >
            削除
          </button>
        </div>
      </div>

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
      </div>
    </div>
  )
}
