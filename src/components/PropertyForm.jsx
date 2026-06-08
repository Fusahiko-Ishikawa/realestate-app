import { useState, useEffect } from 'react'
import styles from './PropertyForm.module.css'

// 物件の新規登録・編集に使うモーダルフォーム
// property が null のとき新規登録モード、オブジェクトのとき編集モード
export default function PropertyForm({ property, onSave, onClose }) {
  const isEdit = property !== null

  const [form, setForm] = useState({
    name: '',
    rent: '',
    area: '',
    floor_plan: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 編集モードのとき既存データをフォームにセットする
  useEffect(() => {
    if (isEdit) {
      setForm({
        name: property.name,
        rent: String(property.rent),
        area: property.area,
        floor_plan: property.floor_plan,
      })
    }
  }, [property, isEdit])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const rent = parseInt(form.rent, 10)
    if (isNaN(rent) || rent <= 0) {
      setError('家賃は1以上の数値を入力してください')
      return
    }

    setLoading(true)
    const { error: saveError } = await onSave({
      name: form.name.trim(),
      rent,
      area: form.area.trim(),
      floor_plan: form.floor_plan.trim(),
    })
    setLoading(false)

    if (saveError) {
      setError('保存に失敗しました: ' + saveError.message)
    } else {
      onClose()
    }
  }

  // オーバーレイクリックで閉じる
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? '物件を編集' : '物件を登録'}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>物件名</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：サンシャインマンション 301"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>家賃（円）</label>
            <input
              name="rent"
              type="number"
              min="1"
              value={form.rent}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：85000"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>エリア</label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：東京都豊島区東池袋"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>間取り</label>
            <input
              name="floor_plan"
              value={form.floor_plan}
              onChange={handleChange}
              className={styles.input}
              placeholder="例：1LDK"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
