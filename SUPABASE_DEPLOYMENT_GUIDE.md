# Supabase Deployment Guide

Your application is built and ready. Now you need to deploy it to Supabase. Follow these steps:

## Prerequisites

- Supabase project ID: `zaisbrmgprltcf`
- Supabase URL: `https://zaisbrmgprltcf.supabase.co`
- Anon key from `.env` file (already configured)

## Step 1: Verify Your Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `zaisbrmgprltcf`
3. You should see your database connected
4. Note the project URL and anon key (these are in your `.env`)

## Step 2: Deploy Edge Functions

### Option A: Using Supabase Dashboard (Recommended for Quick Testing)

**Deploy run-seo-audit function:**

1. Go to Edge Functions in the dashboard
2. Click "Create a new function"
3. Name it: `run-seo-audit`
4. Copy the entire contents of `/supabase/functions/run-seo-audit/index.ts`
5. Paste into the editor
6. Click Deploy

**Deploy semantic-analysis function:**

1. Click "Create a new function"
2. Name it: `semantic-analysis`
3. Copy the entire contents of `/supabase/functions/semantic-analysis/index.ts`
4. Paste into the editor
5. Click Deploy

### Option B: Using Supabase CLI (Recommended for Production)

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-id zaisbrmgprltcf

# Deploy edge functions
supabase functions deploy run-seo-audit --project-id zaisbrmgprltcf
supabase functions deploy semantic-analysis --project-id zaisbrmgprltcf
```

## Step 3: Verify Edge Functions Are Working

After deployment, test the functions:

```bash
# Test run-seo-audit function
curl -X POST https://zaisbrmgprltcf.supabase.co/functions/v1/run-seo-audit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "url": "https://example.com"
  }'

# Expected response:
{
  "score": 75,
  "issues": [...],
  "recommendations": [...],
  "metadata": {...}
}
```

## Step 4: Apply Database Migrations

The database migrations are already in `/supabase/migrations/`. They will be automatically applied when you first connect to Supabase via the CLI:

```bash
# View migrations status
supabase migration list --project-id zaisbrmgprltcf

# Manually apply migrations if needed
supabase db push --project-id zaisbrmgprltcf
```

## Step 5: Verify Database Tables

After migrations run, verify tables were created:

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Run this query to see all tables:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `audit_results`
- `users` (from auth)
- `semantic_analysis_results`
- Other tables based on migrations

## Step 6: Check Row Level Security (RLS)

Verify RLS is enabled on all tables:

```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;
```

All tables should show `rowsecurity = true`.

## Step 7: Test the Full Application

1. Open your application in browser
2. Go to landing page
3. Try an instant audit without signup
4. Enter URL: `https://example.com`
5. Click "Check SEO Score"
6. You should see:
   - Loading spinner for 3-5 seconds
   - Results page with score
   - Issues listed with severity levels
   - Tabs for different issue types

**If this fails, see troubleshooting section below.**

## Step 8: Deploy Your Frontend

Choose one:

### Deploy to Netlify

```bash
# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Vercel

```bash
# Build
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages

```bash
# Build
npm run build

# Push to GitHub
git add .
git commit -m "production build"
git push origin main
```

## Step 9: Set Environment Variables in Production

For your hosting provider, set these environment variables:

```
VITE_SUPABASE_URL=https://zaisbrmgprltcf.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

These should already be in your `.env` file - copy them to your hosting platform.

## Step 10: Test Production Deployment

After deploying:

1. Open your production URL
2. Test landing page loads
3. Run an audit
4. Sign up with test account
5. Run authenticated audit
6. View dashboard

---

## Troubleshooting

### Issue: "Failed to run SEO audit"

**Cause:** Edge functions not deployed

**Fix:**
1. Go to Supabase Dashboard → Edge Functions
2. Confirm `run-seo-audit` shows as deployed
3. Check the Logs tab for errors
4. Redeploy if needed

### Issue: "Private IP addresses are not allowed"

**Cause:** SSRF protection blocked the URL

**This is correct behavior!** The application blocks:
- `http://localhost`
- `http://127.0.0.1`
- `http://192.168.x.x`
- `http://10.x.x.x`
- Local domains (`.local`, `.internal`)

**Solution:** Try with a public URL instead (e.g., `https://example.com`)

### Issue: Database connection error

**Cause:** Migrations not applied

**Fix:**
```bash
# Apply migrations
supabase db push --project-id zaisbrmgprltcf

# Verify tables exist
supabase db tables list --project-id zaisbrmgprltcf
```

### Issue: Authentication not working

**Cause:** Auth not configured in Supabase

**Fix:**
1. Go to Supabase Dashboard
2. Click "Authentication" in left sidebar
3. Go to "Providers" tab
4. Make sure "Email" provider is enabled
5. Go to "URL Configuration"
6. Add your application URL to "Site URL"

Example:
- If deployed to Netlify: `https://myapp.netlify.app`
- If deployed locally: `http://localhost:3000`

### Issue: CORS errors in browser console

**Cause:** Edge functions CORS headers not set correctly

**Fix:** Verify edge function has these headers:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
```

Both deployed functions should have this.

### Issue: Semantic analysis returns "Limited Analysis Available"

**Cause:** OpenAI API key not set

**Fix:**
1. Go to Supabase Dashboard
2. Go to Edge Functions → semantic-analysis
3. Click Settings/Configuration
4. Add secret: `OPENAI_API_KEY` with your OpenAI API key
5. Redeploy the function

### Issue: Application works locally but fails on production

**Cause:** Environment variables not set on hosting platform

**Fix:**
1. Check your hosting dashboard
2. Add these environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy

---

## Monitoring After Deployment

### Check Function Logs

```bash
# View run-seo-audit logs
supabase functions logs run-seo-audit --project-id zaisbrmgprltcf --tail

# View semantic-analysis logs
supabase functions logs semantic-analysis --project-id zaisbrmgprltcf --tail
```

### Monitor Database

In Supabase Dashboard:
1. Click "Realtime" to see live updates
2. Click "Reports" to see database usage
3. Check "Database" → "Backups" for backup status

### Set Up Alerts

In Supabase Dashboard:
1. Go to Database → Alerts
2. Set up alerts for:
   - High connection count
   - Slow queries
   - Failed connections

---

## Quick Checklist

- ✅ Supabase project created and linked
- ✅ Edge functions deployed (run-seo-audit, semantic-analysis)
- ✅ Database migrations applied
- ✅ Authentication configured
- ✅ Environment variables set
- ✅ Frontend built (`npm run build`)
- ✅ Frontend deployed to hosting
- ✅ All URLs configured in Supabase
- ✅ Audit tested on production
- ✅ Authentication tested on production
- ✅ Dashboard accessible after login

---

## Support

For issues:

1. Check this troubleshooting section first
2. Review Supabase documentation: https://supabase.com/docs
3. Check Edge Functions logs in Supabase Dashboard
4. Check browser console for JavaScript errors
5. Review your hosting provider's logs

---

**Your application is production-ready!**

After following these steps, your SEO audit application will be:
- ✅ Deployed on Supabase
- ✅ Running edge functions with SSRF protection
- ✅ Using Supabase authentication
- ✅ Connected to Postgres database
- ✅ Accessible to users worldwide

---

**Status**: Ready for Deployment
**Last Updated**: January 27, 2026
**Project ID**: zaisbrmgprltcf
