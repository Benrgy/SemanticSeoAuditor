# Quick Deploy Guide (5 minutes)

## Your app is BUILT and READY! ✓

Follow these 3 simple steps to go live:

---

## Step 1: Deploy Database (2 min)

Go to your Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/zaisbrmgprltcfhmtrsu/sql/new

Run each migration file (copy/paste and click RUN):
1. `supabase/migrations/20250716012829_warm_poetry.sql`
2. `supabase/migrations/20250717133331_icy_boat.sql`
3. `supabase/migrations/20250717134143_silver_fire.sql`
4. `supabase/migrations/20250814144337_falling_frog.sql`
5. `supabase/migrations/20250814161404_hidden_dew.sql`

---

## Step 2: Deploy Edge Functions (2 min)

Go to Supabase Functions:
👉 https://supabase.com/dashboard/project/zaisbrmgprltcfhmtrsu/functions

Create two functions:

**Function 1: run-seo-audit**
- Click "Create function"
- Name: `run-seo-audit`
- Copy code from `supabase/functions/run-seo-audit/index.ts`
- Deploy

**Function 2: semantic-analysis**
- Click "Create function"
- Name: `semantic-analysis`
- Copy code from `supabase/functions/semantic-analysis/index.ts`
- Deploy

---

## Step 3: Deploy Frontend (1 min)

**Easiest Option - Netlify Drop:**
1. Go to: https://app.netlify.com/drop
2. Drag and drop the `dist/` folder
3. Add environment variables in Site Settings → Environment:
   - `VITE_SUPABASE_URL` = `https://zaisbrmgprltcfhmtrsu.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = [your key from .env file]

**Alternative - Netlify CLI:**
```bash
npx netlify-cli deploy --prod --dir=dist
```

---

## Done! 🎉

Your SEO audit application is now LIVE!

Test it:
1. Visit your Netlify URL
2. Try running an SEO audit
3. Create an account and log in
4. View your audit history in the dashboard

---

Need help? Check `DEPLOYMENT_COMPLETE.md` for detailed instructions.
