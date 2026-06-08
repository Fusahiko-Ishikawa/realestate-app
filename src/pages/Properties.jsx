import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../lib/properties'
import PropertyCard from '../components/PropertyCard'
import PropertyForm from '../components/PropertyForm'
import styles from './Properties.module.css'

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // モーダルの表示制御
  // formTarget: null = 非表示、'new' = 新規登録、object = 編集対象物件
  const [formTarget, setFormTarget] = useState(null)

  // 削除確認ダイアログの対象物件
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 物件一覧をSupabaseから取得する
  const loadProperties = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await fetchProperties()
    if (fetchError) {
      setError('物件の取得に失敗しました')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // 新規登録・更新の保存処理（PropertyForm から呼ばれる）
  const handleSave = async (formData) => {
    if (formTarget === 'new') {
      const result = await createProperty(formData)
      if (!result.error) await loadProperties()
      return result
    } else {
      const result = await updateProperty(formTarget.id, formData)
      if (!result.error) await loadProperties()
      return result
    }
  }

  // 削除確認後に実行する
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    const { error: deleteError } = await deleteProperty(deleteTarget.id)
    setDeleteLoading(false)
    if (deleteError) {
      setError('削除に失敗しました')
    } else {
      setDeleteTarget(null)
      await loadProperties()
    }
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
          <div className={styles.pageHeaderLeft}>
            <h2 className={styles.pageTitle}>物件一覧</h2>
            {!loading && (
              <span className={styles.count}>{properties.length}件</span>
            )}
          </div>
          <button
            className={styles.addButton}
            onClick={() => setFormTarget('new')}
          >
            ＋ 物件を登録
          </button>
        </div>

        {error && <p className={styles.errorBanner}>{error}</p>}

        {loading ? (
          <div className={styles.loadingArea}>
            <span className={styles.loadingText}>読み込み中...</span>
          </div>
        ) : properties.length === 0 ? (
          <div className={styles.emptyArea}>
            <p className={styles.emptyText}>登録されている物件はありません</p>
            <button
              className={styles.addButton}
              onClick={() => setFormTarget('new')}
            >
              最初の物件を登録する
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={(p) => setFormTarget(p)}
                onDelete={(p) => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 新規登録・編集モーダル */}
      {formTarget !== null && (
        <PropertyForm
          property={formTarget === 'new' ? null : formTarget}
          onSave={handleSave}
          onClose={() => setFormTarget(null)}
        />
      )}

      {/* 削除確認ダイアログ */}
      {deleteTarget && (
        <div className={styles.dialogOverlay} onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null) }}>
          <div className={styles.dialog}>
            <h3 className={styles.dialogTitle}>物件を削除しますか？</h3>
            <p className={styles.dialogMessage}>
              「{deleteTarget.name}」を削除します。この操作は元に戻せません。
            </p>
            <div className={styles.dialogActions}>
              <button
                className={styles.dialogCancelButton}
                onClick={() => setDeleteTarget(null)}
              >
                キャンセル
              </button>
              <button
                className={styles.dialogDeleteButton}
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
