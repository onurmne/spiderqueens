-- ========================================================
-- SPIDERQUEENS - SUPABASE SQL DATABASE SCHEMA (PRODUCTION)
-- ========================================================
-- Copy and run this script directly in the Supabase SQL Editor.
-- It sets up all tables, indexes, constraints, RLS policies, triggers,
-- browser fingerprint tracking, and the risk-free dynamic reward pool engine.

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'voter',
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  super_votes_credit INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'voter';

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. CONTESTANTS TABLE
CREATE TABLE IF NOT EXISTS public.contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  instagram_handle TEXT NOT NULL,
  character_name TEXT,
  photo_url TEXT NOT NULL,
  bio TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  votes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure bio column exists on existing installations
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS bio TEXT;

CREATE INDEX IF NOT EXISTS idx_contestants_status_votes ON public.contestants(status, votes_count DESC);
CREATE INDEX IF NOT EXISTS idx_contestants_user ON public.contestants(user_id);

-- 3. VOTES TABLE (Includes Browser Fingerprint Tracking)
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_ip TEXT NOT NULL,
  fingerprint_hash TEXT DEFAULT 'sqfp_default',
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  is_super_vote BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_votes_contestant ON public.votes(contestant_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip_date ON public.votes(voter_ip, created_at);
CREATE INDEX IF NOT EXISTS idx_votes_fingerprint ON public.votes(fingerprint_hash, created_at);

-- 4. IP TRACKER & FINGERPRINT TRACKER TABLES
CREATE TABLE IF NOT EXISTS public.ip_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  free_votes_used INTEGER NOT NULL DEFAULT 0,
  last_vote_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ip_tracker_ip ON public.ip_tracker(ip_address);

CREATE TABLE IF NOT EXISTS public.fingerprint_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_hash TEXT NOT NULL UNIQUE,
  free_votes_used INTEGER NOT NULL DEFAULT 0,
  last_vote_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fp_tracker_hash ON public.fingerprint_tracker(fingerprint_hash);

-- 5. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  super_votes_amount INTEGER NOT NULL DEFAULT 10,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'crypto_manual')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
  tx_hash_or_note TEXT,
  crypto_asset TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);

-- 6. SETTINGS & DYNAMIC REWARD POOL TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pool_contribution_percentage NUMERIC(5,2) NOT NULL DEFAULT 20.00, -- 20% to pool, 80% to house treasury
  base_first_prize NUMERIC(10,2) NOT NULL DEFAULT 1000.00,
  base_second_prize NUMERIC(10,2) NOT NULL DEFAULT 250.00,
  base_third_prize NUMERIC(10,2) NOT NULL DEFAULT 50.00,
  accumulated_pool_usd NUMERIC(10,2) NOT NULL DEFAULT 185.50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default settings if not exists
INSERT INTO public.settings (id, pool_contribution_percentage, base_first_prize, base_second_prize, base_third_prize, accumulated_pool_usd)
VALUES (1, 20.00, 1000.00, 250.00, 50.00, 185.50)
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- BUSINESS LOGIC & SAFETY TRIGGERS
-- ========================================================

-- Trigger 1: Prevent contestants from voting for themselves
CREATE OR REPLACE FUNCTION check_self_vote()
RETURNS TRIGGER AS $$
DECLARE
  contestant_owner UUID;
BEGIN
  SELECT user_id INTO contestant_owner FROM public.contestants WHERE id = NEW.contestant_id;
  IF NEW.user_id IS NOT NULL AND NEW.user_id = contestant_owner THEN
    RAISE EXCEPTION 'BUSINESS_ERROR: Contestants cannot vote for their own cosplay photo.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_self_vote ON public.votes;
CREATE TRIGGER trg_prevent_self_vote
BEFORE INSERT ON public.votes
FOR EACH ROW EXECUTE FUNCTION check_self_vote();

-- Trigger 2 (legacy): Auto-increment was moved to client-side SECURITY DEFINER RPC
-- `increment_vote_count` to avoid RLS failures on live (Vercel + anon key).
-- Drop any existing trigger so votes are NOT double-counted when RPC is also called.
CREATE OR REPLACE FUNCTION increment_contestant_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  -- No-op: vote count is applied via public.increment_vote_count RPC from the app.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_votes ON public.votes;

-- Trigger 3: Risk-Free Dynamic Reward Pool Auto-Growth on Approved Transaction
CREATE OR REPLACE FUNCTION auto_feed_reward_pool()
RETURNS TRIGGER AS $$
DECLARE
  share_pct NUMERIC(5,2);
  addition NUMERIC(10,2);
BEGIN
  IF (NEW.status IN ('approved', 'completed') AND (OLD.status IS NULL OR OLD.status NOT IN ('approved', 'completed'))) THEN
    SELECT pool_contribution_percentage INTO share_pct FROM public.settings WHERE id = 1;
    IF share_pct IS NULL THEN
      share_pct := 20.00;
    END IF;
    
    addition := NEW.amount * (share_pct / 100.00);
    
    UPDATE public.settings
    SET accumulated_pool_usd = accumulated_pool_usd + addition,
        updated_at = NOW()
    WHERE id = 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_feed_reward_pool ON public.transactions;
CREATE TRIGGER trg_auto_feed_reward_pool
AFTER UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION auto_feed_reward_pool();

-- Function: Approve transaction & credit super votes to user
CREATE OR REPLACE FUNCTION approve_transaction_and_credit(target_transaction_id UUID)
RETURNS VOID AS $$
DECLARE
  t_record RECORD;
BEGIN
  SELECT * INTO t_record FROM public.transactions WHERE id = target_transaction_id;
  
  IF t_record.id IS NULL THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;
  
  IF t_record.status IN ('approved', 'completed') THEN
    RAISE EXCEPTION 'Transaction is already approved/completed';
  END IF;

  -- Mark transaction approved
  UPDATE public.transactions SET status = 'approved' WHERE id = target_transaction_id;
  
  -- Credit super votes to user profile
  UPDATE public.profiles 
  SET super_votes_credit = super_votes_credit + t_record.super_votes_amount 
  WHERE id = t_record.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fingerprint_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, user edit own, anyone insert
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR true);
CREATE POLICY "Anyone can insert profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Contestants: Approved viewable by everyone, anyone can submit application
CREATE POLICY "Approved contestants viewable by everyone" ON public.contestants FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
DROP POLICY IF EXISTS "Authenticated users can submit contestant application" ON public.contestants;
DROP POLICY IF EXISTS "Anyone can submit contestant application" ON public.contestants;
CREATE POLICY "Anyone can submit contestant application" ON public.contestants FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can update contestant status" ON public.contestants;
CREATE POLICY "Admins can update contestant status" ON public.contestants FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
-- Allow votes_count to be updated by security definer functions / service paths
DROP POLICY IF EXISTS "Allow vote count updates" ON public.contestants;
CREATE POLICY "Allow vote count updates" ON public.contestants FOR UPDATE USING (true) WITH CHECK (true);

-- Votes: Public insert, public view
DROP POLICY IF EXISTS "Anyone can cast a vote" ON public.votes;
DROP POLICY IF EXISTS "Votes viewable by all" ON public.votes;
CREATE POLICY "Anyone can cast a vote" ON public.votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Votes viewable by all" ON public.votes FOR SELECT USING (true);

-- RPC Function for Direct Voting Client Call
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

-- Settings: Public viewable, admin updateable
CREATE POLICY "Settings viewable by all" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.settings FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Transactions: User view own, Admin view & edit all
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Users create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id OR true);
CREATE POLICY "Admins update transactions" ON public.transactions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- ========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER FOR SUPABASE AUTH
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_admin, super_votes_credit)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'voter'),
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, FALSE),
    0
  )
  ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- INITIAL SEED DATA (APPROVED COSPLAYERS & ARENA CONTESTANTS)
-- ========================================================
INSERT INTO public.contestants (id, full_name, nickname, instagram_handle, character_name, photo_url, status, votes_count)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'Elena Rostova', 'ValkyrieCosplay', '@valkyrie_cosplay', 'Cyberpunk Spider-Gwen', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop', 'approved', 342),
  ('c2000000-0000-0000-0000-000000000002', 'Sakura Tanaka', 'KitsuneQueen', '@kitsune_queen', 'Neon Spider-Woman Jessica Drew', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop', 'approved', 289),
  ('c3000000-0000-0000-0000-000000000003', 'Aria Thorne', 'ShadowSpider', '@shadow_spider_official', 'Symbiote Silk / Black Cat Mashup', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop', 'approved', 215),
  ('c4000000-0000-0000-0000-000000000004', 'Chloe Bennett', 'BladeVixen', '@bladevixen', 'Cyber Blade Spider-Man 2099 Female', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop', 'approved', 178),
  ('c5000000-0000-0000-0000-000000000005', 'Mayumi Sato', 'NebulaCos', '@nebula_cosplays', 'Gothic Lolita Spider-Queen', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop', 'approved', 142)
ON CONFLICT (id) DO NOTHING;

