# PagePulse — SEO Audit SaaS

PagePulse is a full-stack SaaS application that audits websites for SEO health across 6 critical checks, generates professional PDF reports, and manages subscriptions through LemonSqueezy.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom brand tokens
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** LemonSqueezy (Merchant of Record)
- **PDF Generation:** @react-pdf/renderer
- **Deployment:** Vercel

## Features

- Landing page with animated hero, pricing, and waitlist
- Google OAuth + email/password authentication
- 6 SEO audit checks: broken links, alt text, page speed, meta tags, mobile friendliness, heading structure
- Professional PDF report generation with white-label support (Agency plan)
- Plan-gated usage with monthly audit limits
- LemonSqueezy checkout, customer portal, and webhook integration
- Monthly usage reset via Vercel cron job
- Responsive dashboard with sidebar navigation

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/BigLebowskii/PagePulse.git
cd PagePulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values in `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `LEMONSQUEEZY_API_KEY` | LemonSqueezy API key |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret from LemonSqueezy |
| `LEMONSQUEEZY_STORE_ID` | Your LemonSqueezy store ID |
| `LEMONSQUEEZY_STARTER_VARIANT_ID` | Variant ID for Starter plan |
| `LEMONSQUEEZY_GROWTH_VARIANT_ID` | Variant ID for Growth plan |
| `LEMONSQUEEZY_AGENCY_VARIANT_ID` | Variant ID for Agency plan |
| `NEXT_PUBLIC_LS_STARTER_VARIANT_ID` | Same variant ID (client-side) |
| `NEXT_PUBLIC_LS_GROWTH_VARIANT_ID` | Same variant ID (client-side) |
| `NEXT_PUBLIC_LS_AGENCY_VARIANT_ID` | Same variant ID (client-side) |
| `CRON_SECRET` | Secret for protecting the cron endpoint |

### 4. Run database migrations

In your Supabase SQL Editor, run the migration files in order:

```
supabase/migrations/001_create_tables.sql
supabase/migrations/002_create_rls_policies.sql
supabase/migrations/003_create_auth_trigger.sql
supabase/migrations/004_add_lemonsqueezy_fields.sql
supabase/migrations/005_add_whitelabel_fields.sql
```

### 5. Create Supabase Storage bucket

In Supabase Dashboard > Storage:

1. Create a new bucket called `audit-reports`
2. Set it to **Public** (so PDFs can be served via URL)
3. Add a storage policy for authenticated users to read/write files in `reports/{user_id}/`

### 6. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing LemonSqueezy Webhooks Locally

Use a tool like ngrok to expose your local server:

```bash
ngrok http 3000
```

Then set your webhook URL in the LemonSqueezy dashboard to:
`https://your-ngrok-url.ngrok.io/api/lemonsqueezy/webhook`

Subscribe to these webhook events:
- `subscription_created`
- `subscription_updated`
- `subscription_cancelled`
- `subscription_expired`
- `subscription_payment_failed`
- `subscription_payment_success`

## Deploy to Vercel

### 1. Connect to Vercel

Connect your GitHub repo at [vercel.com/new](https://vercel.com/new).

### 2. Set environment variables

In Vercel Dashboard > Settings > Environment Variables, add all variables from `.env.local.example`. Change `NEXT_PUBLIC_APP_URL` to your Vercel domain.

### 3. Configure LemonSqueezy webhook

Set your webhook endpoint in the LemonSqueezy dashboard to:
`https://your-domain.vercel.app/api/lemonsqueezy/webhook`

### 4. Verify cron job

The `vercel.json` configures a cron job to reset monthly usage on the 1st of each month. Verify it in Vercel Dashboard > Cron Jobs.

### 5. Custom domain (optional)

In Vercel Dashboard > Domains, add your custom domain and set these DNS records:
- **A Record**: `76.76.21.21` (root domain)
- **CNAME**: `cname.vercel-dns.com` (www subdomain)

## Project Structure

```
pagepulse/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Auth pages (login, signup, etc.)
│   │   ├── (protected)/dashboard/     # Dashboard pages
│   │   │   ├── audits/                # Audit list + detail pages
│   │   │   ├── new-audit/             # New audit form
│   │   │   └── settings/              # User settings
│   │   └── api/
│   │       ├── audit/                 # Audit CRUD + PDF generation
│   │       ├── auth/                  # Auth routes (signout)
│   │       ├── cron/                  # Monthly usage reset
│   │       ├── lemonsqueezy/          # Checkout, portal, webhook
│   │       └── waitlist/              # Waitlist signup
│   ├── components/
│   │   ├── auth/                      # Auth forms
│   │   ├── dashboard/                 # Dashboard components
│   │   └── ui/                        # Reusable UI components
│   └── lib/
│       ├── audit/                     # SEO audit engine (6 checks)
│       ├── lemonsqueezy/              # LemonSqueezy API client
│       ├── pdf/                       # PDF report generation
│       └── supabase/                  # Supabase clients + types
├── supabase/migrations/               # SQL migration files
├── vercel.json                        # Cron job configuration
└── tailwind.config.ts                 # Custom theme configuration
```

## Plans and Limits

| Plan | Audits/Month | PDF Reports | White-Label | Price |
|------|-------------|-------------|-------------|-------|
| Free | 2 | Yes | No | $0 |
| Starter | 5 | Yes | No | $19/mo |
| Growth | 25 | Yes | No | $49/mo |
| Agency | Unlimited | Yes | Yes | $99/mo |
