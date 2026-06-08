import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未認証ユーザーをログイン画面にリダイレクトするガードコンポーネント
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // セッション復元中はレンダリングをブロックして不要なリダイレクトを防ぐ
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#6b7280' }}>読み込み中...</span>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
