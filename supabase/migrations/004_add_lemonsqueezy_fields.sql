-- ============================================
-- PagePulse LemonSqueezy Fields
-- Migration 004: Add subscription tracking fields
-- ============================================

-- Add subscription status and period tracking
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Indexes for webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_ls_customer_id
  ON public.profiles(lemonsqueezy_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_ls_subscription_id
  ON public.profiles(lemonsqueezy_subscription_id);
