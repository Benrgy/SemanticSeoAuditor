# SEO Audit Tool - Complete Setup Guide

## Current Status

✅ **Fixed Issues:**
- Environment configuration (.env file) has been repaired
- Better error handling and logging added
- Connection validation implemented

⚠️ **Required Actions:**
The following steps need to be completed to make the audit functionality work:

---

## Prerequisites

1. A Supabase account (free tier works fine)
2. Node.js 18+ installed
3. Supabase CLI installed globally

---

## Step 1: Verify Environment Configuration

Your `.env` file has been fixed and should contain:

```env
VITE_SUPABASE_URL=https://zaisbrmgprltcfhmtrsu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **This step is complete!**

---

## Step 2: Set Up Supabase Database

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project:** https://app.supabase.com/project/zaisbrmgprltcfhmtrsu

2. **Navigate to SQL Editor** in the left sidebar

3. **Run each migration file in order:**
   - Go to `supabase/migrations/` folder
   - Copy the contents of each `.sql` file (in chronological order)
   - Paste into SQL Editor and click "Run"

   **Order of migrations:**
   ```
   1. 20250716012829_warm_poetry.sql      (Creates initial tables)
   2. 20250717133331_icy_boat.sql         (Updates RLS policies)
   3. 20250717134143_silver_fire.sql      (Fixes RLS policies)
   4. 20250814144337_falling_frog.sql     (Adds audit RLS policies)
   5. 20250814161404_hidden_dew.sql       (Fixes update policies)
   ```

4. **Create the audit_events table:**
   Run this SQL in the SQL Editor:

   ```sql
   CREATE TABLE IF NOT EXISTS audit_events (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     audit_id uuid REFERENCES audits(id) ON DELETE CASCADE NOT NULL,
     user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
     event_type text NOT NULL,
     metadata jsonb DEFAULT '{}'::jsonb,
     created_at timestamptz DEFAULT now()
   );

   ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Enable audit event creation"
     ON audit_events
     FOR INSERT
     TO anon, authenticated
     WITH CHECK (true);

   CREATE POLICY "Users can view their own audit events"
     ON audit_events
     FOR SELECT
     TO authenticated
     USING (user_id = auth.uid() OR user_id IS NULL);

   CREATE INDEX IF NOT EXISTS idx_audit_events_audit_id ON audit_events(audit_id);
   CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
   CREATE INDEX IF NOT EXISTS idx_audit_events_type ON audit_events(event_type);
   CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at DESC);
   ```

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref zaisbrmgprltcfhmtrsu

# Push migrations
supabase db push
```

---

## Step 3: Deploy Supabase Edge Function

The edge function `run-seo-audit` needs to be deployed to Supabase for the audit to work properly.

### Install Supabase CLI (if not done):

```bash
npm install -g supabase
```

### Link Your Project:

```bash
supabase link --project-ref zaisbrmgprltcfhmtrsu
```

You'll be prompted for your database password. Find it in your Supabase dashboard under Settings > Database.

### Deploy the Edge Function:

```bash
supabase functions deploy run-seo-audit
```

### Verify Deployment:

Test the edge function directly:

```bash
curl -i --location --request POST \
  'https://zaisbrmgprltcfhmtrsu.supabase.co/functions/v1/run-seo-audit' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://example.com"}'
```

Replace `YOUR_ANON_KEY` with your actual anon key from the `.env` file.

---

## Step 4: Enable Authentication (Optional but Recommended)

1. Go to **Authentication** > **Providers** in Supabase Dashboard
2. Enable **Email** provider
3. Configure email templates (optional)

---

## Step 5: Test the Application

### Start the Development Server:

```bash
npm install  # if you haven't already
npm run dev
```

### Test the Audit Feature:

1. Open http://localhost:5173 in your browser
2. Open browser console (F12 > Console tab)
3. Enter a website URL (try: `https://example.com`)
4. Click "Start Free SEO Audit"

### Expected Console Output:

```
🔍 Attempting to analyze: https://example.com
📡 Using edge function: https://zaisbrmgprltcfhmtrsu.supabase.co/functions/v1/run-seo-audit
✅ Audit completed via edge function
```

### If Edge Function Fails:

The app will try a direct fetch fallback. You'll see:

```
⚠️ Edge function unavailable, trying direct fetch
✅ Audit completed via direct fetch (fallback)
```

---

## Step 6: Build and Deploy

### Build for Production:

```bash
npm run build
```

### Deploy to Netlify:

```bash
npm run build:netlify
```

Then deploy the `dist/` directory to Netlify.

---

## Troubleshooting

### Issue: "Database tables need to be created"

**Solution:** Run all migrations in Supabase SQL Editor (Step 2)

### Issue: "Edge function unavailable"

**Solution:** Deploy the edge function using `supabase functions deploy run-seo-audit` (Step 3)

### Issue: "Failed to save audit"

**Solution:**
1. Check RLS policies are properly set
2. Verify the audits table exists
3. Check browser console for specific error messages

### Issue: "Supabase configuration missing"

**Solution:**
1. Verify `.env` file exists and has correct values
2. Restart the development server: `npm run dev`
3. Check that environment variables start with `VITE_`

### Issue: CORS errors when auditing websites

**Solution:** This is expected for some websites. The edge function should bypass CORS. Make sure it's deployed (Step 3).

---

## Verification Checklist

Before considering the setup complete, verify:

- [ ] `.env` file exists with correct Supabase credentials
- [ ] All database migrations have been run
- [ ] `audits` table exists in Supabase
- [ ] `audit_events` table exists in Supabase
- [ ] RLS policies are enabled on all tables
- [ ] Edge function `run-seo-audit` is deployed
- [ ] Application starts without errors (`npm run dev`)
- [ ] Can perform an audit on `https://example.com`
- [ ] Audit result appears in the dashboard
- [ ] No console errors during audit

---

## Next Steps

Once everything is working:

1. **Test with different websites** to ensure reliability
2. **Enable authentication** if you want user accounts
3. **Deploy to production** (Netlify/Vercel)
4. **Set up monitoring** for edge function errors
5. **Configure email notifications** (optional)

---

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Check Supabase logs: Project Dashboard > Logs
3. Verify edge function logs: Functions > run-seo-audit > Logs
4. Review this guide carefully

---

## Architecture Overview

```
User enters URL
     ↓
Frontend (React)
     ↓
auditService.performAudit()
     ↓
Supabase Edge Function (run-seo-audit)
     ↓
Fetches & analyzes website HTML
     ↓
Returns audit results
     ↓
auditService.runSEOAudit()
     ↓
Saves to Supabase database (audits table)
     ↓
User sees audit report
```

The edge function is critical because it bypasses CORS restrictions that prevent direct browser-to-website requests.
