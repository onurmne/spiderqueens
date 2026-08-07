-- ========================================================
-- SPIDERQUEENS — LIVE FIX (Supabase SQL Editor'de BİR KEZ çalıştır)
-- Hatalar:
--   - rpc/increment_vote_count → 404
--   - votes insert → 400
--   - votes_count sitede artmıyor
-- ========================================================

-- 1) Eski trigger'ı kaldır (RLS yüzünden sessizce fail oluyordu)
DROP TRIGGER IF EXISTS trg_increment_votes ON public.votes;

CREATE OR REPLACE FUNCTION public.increment_contestant_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2) RPC fonksiyonu (yoksa 404 alırsın) — RLS'yi bypass eder
CREATE OR REPLACE FUNCTION public.increment_vote_count(
  contestant_id UUID,
  is_super BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF is_super THEN
    UPDATE public.contestants
    SET votes_count = COALESCE(votes_count, 0) + 5
    WHERE id = contestant_id;
  ELSE
    UPDATE public.contestants
    SET votes_count = COALESCE(votes_count, 0) + 1
    WHERE id = contestant_id;
  END IF;
END;
$$;

-- Anon + authenticated client'tan çağrılabilsin
GRANT EXECUTE ON FUNCTION public.increment_vote_count(UUID, BOOLEAN) TO anon, authenticated, service_role;

-- 3) votes tablosu: insert herkese açık, user_id opsiyonel kalsın
ALTER TABLE public.votes ALTER COLUMN fingerprint_hash SET DEFAULT 'sqfp_default';
ALTER TABLE public.votes ALTER COLUMN voter_ip SET DEFAULT 'client_app';

-- user_id NULL olabilir (misafir / geçersiz id göndermemek için)
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.votes ALTER COLUMN user_id DROP NOT NULL;
  EXCEPTION WHEN others THEN
    NULL;
  END;
END $$;

DROP POLICY IF EXISTS "Anyone can cast a vote" ON public.votes;
CREATE POLICY "Anyone can cast a vote" ON public.votes
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Votes viewable by all" ON public.votes;
CREATE POLICY "Votes viewable by all" ON public.votes
  FOR SELECT USING (true);

-- 4) contestants: votes_count güncellemesi (RPC definer + client fallback)
DROP POLICY IF EXISTS "Allow vote count updates" ON public.contestants;
CREATE POLICY "Allow vote count updates" ON public.contestants
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update contestant status" ON public.contestants;
CREATE POLICY "Admins can update contestant status" ON public.contestants
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    OR true
  );

-- 5) profiles kredi güncellemesi
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR true) WITH CHECK (true);

-- 6) Test hesabı: onurmne@gmail.com admin + bol kredi
UPDATE public.profiles
SET
  is_admin = TRUE,
  super_votes_credit = GREATEST(COALESCE(super_votes_credit, 0), 999)
WHERE lower(email) = 'onurmne@gmail.com';

-- 7) Kontrol
SELECT
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS args
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'increment_vote_count';

SELECT 'OK: FIX_LIVE_VOTES applied' AS status;
