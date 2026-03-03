-- ============================================
-- PagePulse White-Label Fields
-- Migration 005: Add company_name and brand_color for Agency plan
-- ============================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS brand_color TEXT DEFAULT '#2563EB';
