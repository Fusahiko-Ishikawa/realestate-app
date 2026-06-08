import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Auth.module.css'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError('登録に失敗しました: ' + signUpError.message)
    } else {
      // Supabase はデフォルトでメール確認を要求するため案内を表示
      setMessage('確認メールを送信しました。メールのリンクをクリックしてアカウントを有効化してください。')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>会員登録</h1>
        <p className={styles.subtitle}>新しいアカウントを作成</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="パスワードを入力"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '登録中...' : '会員登録'}
          </button>
        </form>

        <p className={styles.link}>
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
