# SEO Audit Application - Deployment Guide

## Status: Ready for Deployment ✓

Your application has been built successfully and is ready to deploy!

---

## Prerequisites Checklist

✓ Supabase project configured
✓ Environment variables set in `.env`
✓ Production build completed
✓ Database migrations ready
✓ Edge functions ready for deployment

---

## Quick Deployment Steps

### 1. Database Setup (5 minutes)

Your database migrations are located in `supabase/migrations/`. Apply them in this order:

1. **Option A: Using Supabase Dashboard (Recommended)**
   - Go to https://supabase.com/dashboard/project/zaisbrmgprltcfhmtrsu/sql/new
   - Copy and paste each migration file content in order:
     1. `20250716012829_warm_poetry.sql` - Creates initial tables
     2. `20250717133331_icy_boat.sql` - Updates RLS policies
     3. `20250717134143_silver_fire.sql` - Fixes audit policies
     4. `20250814144337_falling_frog.sql` - Improves anonymous access
     5. `20250814161404_hidden_dew.sql` - Final policy updates
   - Click "RUN" for each migration

2. **Option B: Using Supabase CLI**
   ```bash
   npx supabase db push
   ```

### 2. Deploy Edge Functions (10 minutes)

Deploy your two edge functions to Supabase:

#### Using Supabase Dashboard:

1. **Deploy run-seo-audit function:**
   - Go to https://supabase.com/dashboard/project/zaisbrmgprltcfhmtrsu/functions
   - Click "Create a new function"
   - Name: `run-seo-audit`
   - Copy content from `supabase/functions/run-seo-audit/index.ts`
   - Click "Deploy function"

2. **Deploy semantic-analysis function:**
   - Create another function named `semantic-analysis`
   - Copy content from `supabase/functions/semantic-analysis/index.ts`
   - Add environment variable: `OPENAI_API_KEY` (if you have one)
   - Click "Deploy function"

#### Using Supabase CLI:

```bash
npx supabase functions deploy run-seo-audit
npx supabase functions deploy semantic-analysis
```

**Note:** The semantic-analysis function requires an OpenAI API key for advanced analysis. If you don't have one, the function will use fallback analysis.

### 3. Deploy to Netlify (5 minutes)

#### Option A: Drag and Drop
1. Go to https://app.netlify.com/drop
2. Drag the `dist/` folder
3. Add environment variables in Site Settings:
   - `VITE_SUPABASE_URL`: https://zaisbrmgprltcfhmtrsu.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: [your anon key from .env]

#### Option B: Using Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option C: Connect GitHub Repository
1. Push your code to GitHub
2. Go to https://app.netlify.com/
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables as above

---

## Testing Your Deployment

After deployment, test these features:

1. **Homepage Load:** Visit your deployed URL
2. **Anonymous Audit:** Try running an SEO audit without logging in
3. **User Registration:** Create a new account
4. **User Login:** Sign in with credentials
5. **Authenticated Audit:** Run an audit while logged in
6. **Dashboard:** Check saved audits in dashboard
7. **File Management:** Test file upload functionality

---

## Edge Function URLs

After deploying edge functions, they'll be available at:

- **SEO Audit:** `https://zaisbrmgprltcfhmtrsu.supabase.co/functions/v1/run-seo-audit`
- **Semantic Analysis:** `https://zaisbrmgprltcfhmtrsu.supabase.co/functions/v1/semantic-analysis`

Test them with:

```bash
# Test SEO Audit
curl -X POST 'https://zaisbrmgprltcfhmtrsu.supabase.co/functions/v1/run-seo-audit' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'

# Test Semantic Analysis
curl -X POST 'https://zaisbrmgprltcfhmtrsu.supabase.co/functions/v1/semantic-analysis' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com", "content": "test content", "keywords": ["seo", "audit"]}'
```

---

## Database Schema

Your database includes these tables:

- **audits**: Stores SEO audit results
- **notifications**: User notifications
- **usage_analytics**: Track user events and analytics
- **auth.users**: Supabase authentication (built-in)

All tables have Row Level Security (RLS) enabled for data protection.

---

## Environment Variables

Production environment variables needed:

```env
VITE_SUPABASE_URL=https://zaisbrmgprltcfhmtrsu.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Optional (for semantic analysis):
```env
OPENAI_API_KEY=your_openai_key_here
```

---

## Authentication Setup

Email/password authentication is configured by default in Supabase:

1. Go to https://supabase.com/dashboard/project/zaisbrmgprltcfhmtrsu/auth/users
2. Check Authentication → Providers → Email is enabled
3. Email confirmations are disabled by default (users can sign up immediately)

---

## Troubleshooting

### Edge Function Errors
- Check function logs in Supabase Dashboard
- Verify CORS headers are present in responses
- Ensure environment variables are set

### Authentication Issues
- Verify Supabase URL and anon key are correct
- Check RLS policies in database
- Test with Supabase Dashboard → Authentication

### Build Errors
- Run `npm install` to ensure dependencies are updated
- Check for TypeScript errors: `npm run lint`
- Clear cache: `rm -rf dist/ node_modules/.vite/`

### Database Connection Issues
- Verify credentials in `.env` file
- Check Supabase project status in dashboard
- Test connection with: `curl https://zaisbrmgprltcfhmtrsu.supabase.co/rest/v1/`

---

## Production Checklist

Before going live:

- [ ] All database migrations applied
- [ ] Both edge functions deployed
- [ ] Environment variables configured
- [ ] Frontend deployed to Netlify
- [ ] Test user registration and login
- [ ] Test anonymous audit functionality
- [ ] Test authenticated audit functionality
- [ ] Verify dashboard loads user data
- [ ] Check SEO meta tags are present
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Configure email templates in Supabase (optional)

---

## Next Steps

1. **Custom Domain:** Add a custom domain in Netlify settings
2. **Email Templates:** Customize auth emails in Supabase Dashboard
3. **Analytics:** Set up Google Analytics or Plausible
4. **Monitoring:** Enable Supabase Performance monitoring
5. **SEO:** Submit sitemap to Google Search Console

---

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com
- Project Dashboard: https://supabase.com/dashboard/project/zaisbrmgprltcfhmtrsu

---

**Your application is production-ready! 🚀**

All code has been built successfully. Follow the steps above to complete your deployment.
