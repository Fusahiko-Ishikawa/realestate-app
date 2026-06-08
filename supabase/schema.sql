-- ============================================================
-- 物件テーブル
-- ============================================================
create table if not exists properties (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  rent        integer     not null check (rent > 0),
  area        text        not null,
  floor_plan  text        not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security（RLS）を有効化
-- ============================================================
alter table properties enable row level security;

-- SELECT: 自分が登録した物件のみ取得可能
create policy "自分の物件のみ取得" on properties
  for select
  using (auth.uid() = user_id);

-- INSERT: ログイン済みユーザーは自分のIDで物件を登録可能
create policy "自分の物件のみ登録" on properties
  for insert
  with check (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新可能
create policy "自分の物件のみ更新" on properties
  for update
  using (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除可能
create policy "自分の物件のみ削除" on properties
  for delete
  using (auth.uid() = user_id);
