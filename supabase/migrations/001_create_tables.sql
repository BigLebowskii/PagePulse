-- ============================================
-- PagePulse Database Schema
-- Migration 001: Create core tables
-- ============================================

-- 1. PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'growth', 'agency')),
  lemonsqueezy_customer_id TEXT,
  lemonsqueezy_subscription_id TEXT,
  audits_used_this_month INTEGER NOT NULL DEFAULT 0,
  audits_limit INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster lookups by email
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- 2. AUDITS TABLE (each SEO scan)
CREATE TABLE public.audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  results JSONB,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Index for faster lookups by user
CREATE INDEX idx_audits_user_id ON public.audits(user_id);
-- Index for sorting by creation date
CREATE INDEX idx_audits_created_at ON public.audits(created_at DESC);

-- 3. WAITLIST TABLE (landing page signups)
CREATE TABLE public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL DEFAULT 'landing_page',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for duplicate checking
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- 4. Auto-update `updated_at` trigger for profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
