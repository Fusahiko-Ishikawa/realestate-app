import { supabase } from './supabase'

// 自分が登録した物件を登録日時の降順で取得する
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

// 新規物件を登録する（user_id は現在のログインユーザーのIDをセット）
export async function createProperty({ name, rent, area, floor_plan }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('properties')
    .insert({ name, rent, area, floor_plan, user_id: user.id })
    .select()
    .single()
  return { data, error }
}

// 指定IDの物件を更新する（RLS により自分の物件のみ更新可能）
export async function updateProperty(id, { name, rent, area, floor_plan }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent, area, floor_plan })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// 指定IDの物件を削除する（RLS により自分の物件のみ削除可能）
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  return { error }
}
