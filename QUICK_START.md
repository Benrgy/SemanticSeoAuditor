# Quick Start - Troubleshooting SEO Audit Issues

## The audit tool is failing? Here's what to do:

### Step 1: Start the dev server

```bash
npm run dev
```

### Step 2: Open the Diagnostics Page

Visit: **http://localhost:5173/#/diagnostics**

This page will automatically test:
- ✅ Environment variables
- ✅ Supabase database connection
- ✅ Edge function deployment status
- ✅ CORS fallback capability

### Step 3: Follow the recommendations

The diagnostics page will tell you exactly what's wrong and what to fix.

---

## Most Common Issues

### Issue: "Edge function not deployed"

**Fix:**
```bash
npm install -g supabase
supabase link --project-ref zaisbrmgprltcfhmtrsu
supabase functions deploy run-seo-audit
```

### Issue: "Database tables not created"

**Fix:**
1. Go to: https://app.supabase.com/project/zaisbrmgprltcfhmtrsu
2. Click "SQL Editor" in the sidebar
3. Copy and paste each migration file from `supabase/migrations/` (in order)
4. Click "Run" for each one

### Issue: "CORS blocked"

**This is normal!** Most websites block direct browser requests. That's why you need the edge function (see above).

---

## Testing Your Setup

Once everything is fixed, test with these URLs:

1. **Easy test:** `https://example.com` - Should always work
2. **Real-world test:** `https://github.com` - Requires edge function
3. **Your own site:** Enter any website you want to audit

---

## Still Having Issues?

1. Check browser console (F12 > Console) for detailed error messages
2. Look for emoji indicators:
   - 🔍 = Starting audit
   - ✅ = Success
   - ❌ = Error
   - ⚠️ = Warning/Fallback

3. See `SETUP_GUIDE.md` for complete setup instructions
4. Run `node test-setup.cjs` to verify your local setup

---

## What URL are you trying?

Different URLs have different requirements:

| Website | Requirement |
|---------|-------------|
| example.com | Works with or without edge function |
| Most corporate sites | **Requires edge function** (CORS) |
| localhost sites | Cannot audit (not publicly accessible) |
| HTTPS sites only | HTTP sites may fail |

---

## Quick Command Reference

```bash
# Verify setup
node test-setup.cjs

# Test edge function
bash test-edge-function.sh

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy edge function
supabase functions deploy run-seo-audit
```

---

## Architecture

```
Your Browser
    ↓
Frontend (React)
    ↓
Tries: Edge Function (recommended)
    ↓
Falls back to: Direct Fetch (limited)
    ↓
Returns: SEO Audit Results
    ↓
Saves to: Supabase Database
```

The edge function is important because it:
- Bypasses CORS restrictions
- Provides a consistent User-Agent
- Works with all websites
- Is more reliable

Without it, you can only audit sites that allow CORS requests (like example.com).
