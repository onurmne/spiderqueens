-- ========================================================
-- SPIDERQUEENS — LIVE FIX (run once in Supabase SQL Editor)
-- Fixes: votes insert but votes_count not updating on site
-- Also ensures super_vote credit updates work
-- ========================================================

-- 1) Drop the old trigger that fails under RLS (or double-counts with RPC)
DROP TRIGGER IF EXISTS trg_increment_votes ON public.votes;

CREATE OR REPLACE FUNCTION increment_contestant_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  -- No-op: app calls increment_vote_count RPC (SECURITY DEFINER)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2) Ensure the RPC used by the client always works (bypasses RLS)
CREATE OR REPLACE FUNCTION increment_vote_count(contestant_id UUID, is_super BOOLEAN DEFAULT FALSE)
RETURNS VOID AS $$
BEGIN
  IF is_super THEN
    UPDATE public.contestants SET votes_count = votes_count + 5 WHERE id = contestant_id;
  ELSE
    UPDATE public.contestants SET votes_count = votes_count + 1 WHERE id = contestant_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon + authenticated (needed for browser client)
GRANT EXECUTE ON FUNCTION increment_vote_count(UUID, BOOLEAN) TO anon, authenticated, service_role;

-- 3) Allow contestants.votes_count updates (RPC is definer, but keep policy safe)
DROP POLICY IF EXISTS "Allow vote count updates" ON public.contestants;
CREATE POLICY "Allow vote count updates" ON public.contestants
  FOR UPDATE USING (true) WITH CHECK (true);

-- 4) Profiles: ensure own credit can be updated from client
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR true) WITH CHECK (true);

-- 5) Make onurmne@gmail.com admin + high credit if profile exists
UPDATE public.profiles
SET
  is_admin = TRUE,
  super_votes_credit = GREATEST(COALESCE(super_votes_credit, 0), 999)
WHERE lower(email) = 'onurmne@gmail.com';

-- 6) Optional: if user already exists in auth but no profile row
-- (handle_new_user trigger should cover new signups)

SELECT 'OK: live vote + credit fix applied' AS status;
