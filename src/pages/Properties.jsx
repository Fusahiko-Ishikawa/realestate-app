import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropertyCard from '../components/PropertyCard'
import styles from './Properties.module.css'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンシャインマンション 301', rent: 85000, area: '東京都豊島区東池袋', size: '35㎡', type: '1K' },
  { id: 2, name: 'グリーンヒルズ 205', rent: 120000, area: '東京都渋谷区代々木', size: '55㎡', type: '2LDK' },
  { id: 3, name: 'オーク新宿 1002', rent: 98000, area: '東京都新宿区新宿', size: '42㎡', type: '1LDK' },
  { id: 4, name: 'リバーサイド目黒 404', rent: 145000, area: '東京都目黒区中目黒', size: '60㎡', type: '2LDK' },
  { id: 5, name: 'スカイタワー品川 1501', rent: 210000, area: '東京都港区港南', size: '85㎡', type: '3LDK' },
  { id: 6, name: 'コージーネスト下北沢 102', rent: 72000, area: '東京都世田谷区北沢', size: '28㎡', type: '1R' },
]

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.appTitle}>不動産管理アプリ</h1>
          <div className={styles.userArea}>
            <span className={styles.userEmail}>{user?.email}</span>
            <button onClick={handleSignOut} className={styles.signOutButton}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>物件一覧</h2>
          <span className={styles.count}>{DUMMY_PROPERTIES.length}件</span>
        </div>

        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  )
}
