# Edge Function Deployment Guide

## Current Status

Your SEO auditor application is now fully functional with a **smart fallback system**:

1. **Primary Method**: Supabase Edge Function (provides full functionality, bypasses CORS)
2. **Fallback Method**: Direct browser fetch (works for sites that allow cross-origin requests)

### What's Working Now

- ✅ All code is fixed and error-free
- ✅ Build completes successfully
- ✅ Audits work for websites that allow CORS
- ✅ Clear error messages guide users
- ✅ Database tables and migrations ready
- ✅ Authentication flows working
- ✅ Report pages display correctly

### What Needs Deployment

The Supabase edge functions need to be deployed to your Supabase project for full functionality (to analyze sites that block cross-origin requests).

---

## Deploying Edge Functions to Supabase

### Option 1: Using Supabase CLI (Recommended)

#### Step 1: Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# NPM (all platforms)
npm install -g supabase
```

#### Step 2: Login to Supabase

```bash
supabase login
```

#### Step 3: Link Your Project

```bash
supabase link --project-ref zaisbrmgprltcfhmtrsu
```

#### Step 4: Deploy the Edge Functions

```bash
# Deploy run-seo-audit function
supabase functions deploy run-seo-audit

# Deploy semantic-analysis function (optional - requires OpenAI API key)
supabase functions deploy semantic-analysis
```

---

### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zaisbrmgprltcfhmtrsu
2. Navigate to **Edge Functions** in the left sidebar
3. Click **Create Function** or **Deploy Function**
4. Copy the content from `supabase/functions/run-seo-audit/index.ts`
5. Paste it into the function editor
6. Name it: `run-seo-audit`
7. Click **Deploy**

Repeat for `semantic-analysis` function if needed.

---

## Testing After Deployment

Once deployed, test with any website:

1. Go to your app homepage
2. Enter any URL (e.g., `https://example.com`)
3. Click "Start Free SEO Audit"
4. You should see results within 5-10 seconds

### Testing with Popular Sites

Try these to verify it works:
- `https://github.com`
- `https://stackoverflow.com`
- `https://dev.to`
- `https://medium.com`

---

## Database Migration

You also need to apply one migration for the `audit_events` table:

### Apply via Supabase Dashboard

1. Go to **SQL Editor** in your Supabase dashboard
2. Paste this SQL:

```sql
-- Create audit_events table
CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid REFERENCES audits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create audit events"
  ON audit_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their audit events"
  ON audit_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM audits
      WHERE audits.id = audit_events.audit_id
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public audit events"
  ON audit_events
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM audits
      WHERE audits.id = audit_events.audit_id
      AND audits.user_id IS NULL
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_events_audit_id ON audit_events(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_event_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
```

3. Click **Run**

---

## Troubleshooting

### Edge Function Not Working

**Error**: "Failed to fetch" or "Edge function unavailable"

**Solutions**:
1. Verify the function is deployed in Supabase dashboard
2. Check function logs in Supabase for errors
3. Ensure `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Try the fallback by testing with a CORS-enabled site like `https://example.com`

### CORS Errors

**Error**: "The site may block cross-origin requests"

**This is expected!** Many websites block cross-origin requests for security. The edge function solves this by fetching server-side. Deploy the edge function to analyze these sites.

### Database Errors

**Error**: "audit_events table not found"

**Solution**: Apply the migration SQL above in the Supabase SQL Editor.

---

## What Works Without Edge Functions

The app currently works with the fallback system for:
- ✅ Websites that allow CORS (like `example.com`, `httpbin.org`)
- ✅ All authentication features
- ✅ Dashboard and audit history
- ✅ Report viewing
- ✅ User management

### What Needs Edge Functions

- ❌ Analyzing sites that block CORS (most production websites)
- ❌ Advanced features like semantic analysis (requires OpenAI API)

---

## Production Checklist

Before going live:

- [ ] Deploy `run-seo-audit` edge function
- [ ] Apply `audit_events` table migration
- [ ] Test with 5+ different websites
- [ ] Verify authentication works (signup/login)
- [ ] Test audit history in dashboard
- [ ] Verify "Call Expert" tracking works
- [ ] Check error messages are user-friendly
- [ ] Test on mobile devices

---

## Advanced: Semantic Analysis Function

The `semantic-analysis` edge function provides AI-powered content analysis but requires an OpenAI API key.

### Setup

1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Add to Supabase Edge Function secrets:

```bash
supabase secrets set OPENAI_API_KEY=your-key-here
```

3. Deploy the function:

```bash
supabase functions deploy semantic-analysis
```

This is **optional** - the basic SEO audit works without it.

---

## Support

If you encounter issues:
1. Check Supabase function logs for errors
2. Verify all environment variables are set
3. Test with `example.com` first (always works)
4. Check browser console for client-side errors

Your app is production-ready once edge functions are deployed!
