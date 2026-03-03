-- ============================================
-- PagePulse Row Level Security (RLS) Policies
-- Migration 002: Secure all tables
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- ========== PROFILES POLICIES ==========

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========== AUDITS POLICIES ==========

-- Users can view their own audits
CREATE POLICY "Users can view own audits"
  ON public.audits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create audits for themselves
CREATE POLICY "Users can create own audits"
  ON public.audits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ========== WAITLIST POLICIES ==========

-- Anyone can insert into waitlist (no auth needed)
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

-- No public reads on waitlist (admin only via service role)
-- No SELECT policy = no public reads
