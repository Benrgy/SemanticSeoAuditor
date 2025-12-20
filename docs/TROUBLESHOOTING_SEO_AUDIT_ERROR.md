# Troubleshooting SEO Audit Error

## Error Message
```
Failed to run SEO audit: Unable to analyze website. The site may block cross-origin
requests or the edge function may not be deployed. Try deploying the Supabase edge
function 'run-seo-audit' for full functionality.
```

---

## Understanding the Error

### What This Error Means
Your SEO audit tool uses a two-stage approach to analyze websites:

1. **Primary Method**: Call a Supabase Edge Function (`run-seo-audit`) that fetches and analyzes the website server-side
2. **Fallback Method**: If the edge function fails, try fetching the website directly from your browser (client-side)

This error occurs when **BOTH** methods fail, which can happen for two main reasons:

### Root Cause #1: Edge Function Not Deployed
**Technical Explanation**: The Supabase edge function `run-seo-audit` hasn't been deployed to your Supabase project yet. When your application tries to call it at:
```
https://YOUR-PROJECT.supabase.co/functions/v1/run-seo-audit
```
It receives a 404 (Not Found) or 500 (Server Error) response.

**Impact**: Without the edge function, the tool can only analyze websites that allow cross-origin requests from browsers.

---

### Root Cause #2: Website Blocks Cross-Origin Requests (CORS)
**Technical Explanation**: When the edge function isn't available, the app tries to fetch the website directly from your browser. However, most websites block requests from other domains (called "cross-origin requests") for security reasons. This is controlled by CORS (Cross-Origin Resource Sharing) policies.

**Example**: If you're running your app at `http://localhost:5173` and try to analyze `https://example.com`, your browser blocks the request because example.com doesn't explicitly allow requests from localhost.

**Impact**: You can only analyze websites that have permissive CORS settings (which is rare).

---

## Solution Priority Ranking

### 🔴 **PRIORITY 1: Deploy the Edge Function** (Recommended - Fixes 95% of cases)

This is the primary solution and will allow you to analyze ANY website, regardless of their CORS policy.

#### Step 1: Check if Edge Function Exists

First, verify if the function code exists in your project:

```bash
# From your project root directory
ls -la supabase/functions/run-seo-audit/
```

**Expected output**: You should see `index.ts` file

**If the file doesn't exist**: The function code is missing. Skip to "Step 3: Create the Function Code"

---

#### Step 2: Verify Current Deployment Status

Check if the function is already deployed in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** (in the left sidebar)
4. Look for a function named `run-seo-audit`

**Possible States:**
- ✅ **Function exists and shows "Deployed"**: The function is deployed. Skip to Priority 2.
- ⚠️ **Function exists but shows "Failed" or "Error"**: Redeploy the function (continue to Step 4)
- ❌ **Function doesn't exist in the list**: Continue to Step 3

---

#### Step 3: Create the Function Code

If the function code doesn't exist, create it:

1. Create the directory structure:
```bash
mkdir -p supabase/functions/run-seo-audit
```

2. Create the function file:
```bash
# The function code already exists at:
# supabase/functions/run-seo-audit/index.ts
#
# If it's missing, copy it from the DEPLOY_GUIDE.md or ask for the code
```

---

#### Step 4: Deploy to Supabase

**Option A: Deploy via Supabase Dashboard (Easiest)**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project
2. Click **Edge Functions** in the left sidebar
3. Click **"New Function"** button
4. Enter function name: `run-seo-audit`
5. Copy the entire content from `supabase/functions/run-seo-audit/index.ts`
6. Paste it into the code editor
7. Click **"Deploy"**
8. Wait 15-30 seconds for deployment to complete

**Option B: Deploy via Supabase CLI** (If you have it installed)

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR-PROJECT-REF

# Deploy the function
supabase functions deploy run-seo-audit
```

---

#### Step 5: Verify Deployment

Test the function using the provided test script:

```bash
# Edit TEST_DEPLOYED_FUNCTIONS.sh and add your credentials
nano TEST_DEPLOYED_FUNCTIONS.sh

# Update these variables:
# PROJECT_REF="your-actual-project-ref"
# ANON_KEY="your-actual-anon-key"

# Run the test
chmod +x TEST_DEPLOYED_FUNCTIONS.sh
./TEST_DEPLOYED_FUNCTIONS.sh
```

**Alternative: Test with curl directly**

```bash
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/run-seo-audit \
  -H "Authorization: Bearer YOUR-ANON-KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**Expected Response** (Success):
```json
{
  "score": 85,
  "issues": [...],
  "recommendations": [...],
  "metadata": {...}
}
```

**Error Responses**:
- **404 "Function not found"**: Function isn't deployed. Return to Step 4.
- **500 "Internal Server Error"**: Check Supabase Dashboard → Edge Functions → Logs for details
- **401 "Unauthorized"**: Wrong ANON_KEY. Get the correct key from Supabase Dashboard → Settings → API

---

#### Step 6: Test in Your Application

1. Open your SEO audit application in the browser
2. Enter any website URL (e.g., `https://example.com`)
3. Click "Run Audit"
4. The audit should now complete successfully

**If it still fails**: Check browser console (F12 → Console tab) for specific error messages and proceed to "Advanced Troubleshooting"

---

### 🟡 **PRIORITY 2: Check Environment Variables**

If the edge function is deployed but still failing, verify your environment configuration.

#### Step 1: Verify .env File

Check that your `.env` file contains the correct Supabase credentials:

```bash
cat .env
```

**Required variables:**
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**To get these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → Use for `VITE_SUPABASE_ANON_KEY`

---

#### Step 2: Restart Development Server

After updating `.env`, restart your dev server to load new environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

**Note**: Environment variables are only loaded when the dev server starts, not during hot reload.

---

### 🟢 **PRIORITY 3: Website-Specific CORS Issues**

If the edge function works for some websites but not others, the specific website might have additional protections.

#### Understanding Website Protections

Some websites actively block automated tools and scrapers:

1. **Bot Detection**: Sites like Cloudflare can detect and block automated requests
2. **Rate Limiting**: Too many requests in a short time trigger blocks
3. **IP Blocking**: Some sites block cloud server IPs (including Supabase)
4. **JavaScript Required**: Some sites need JavaScript to render content

#### Testing Which Sites Work

**Sites that typically WORK:**
- ✅ https://example.com (always accessible)
- ✅ Most small business websites
- ✅ Personal blogs and portfolios
- ✅ Sites without heavy bot protection

**Sites that may NOT work:**
- ❌ Sites behind Cloudflare with strict settings
- ❌ Single Page Applications (SPAs) that require JavaScript
- ❌ Sites with aggressive bot detection (LinkedIn, Facebook, etc.)
- ❌ Sites that require authentication/login

#### Solutions for Protected Sites

**Option A: Test with a Simple Website First**
```bash
# Try analyzing example.com first
# This confirms your setup works
```

**Option B: Analyze Your Own Website**
If you're trying to analyze your own site and it's blocked:
1. Temporarily disable Cloudflare or bot protection
2. Add Supabase IP ranges to your allowlist
3. Use a staging/development version of your site

**Option C: Manual Analysis**
For sites that can't be accessed programmatically:
1. View the page source manually (Right-click → View Page Source)
2. Copy the HTML
3. Use a local HTML analyzer (we can build this feature if needed)

---

## Verification Checklist

Use this checklist to confirm everything is working:

- [ ] **Edge function exists**: Check `supabase/functions/run-seo-audit/index.ts` exists
- [ ] **Function deployed**: Visible in Supabase Dashboard → Edge Functions
- [ ] **Function responds**: Test with curl returns valid JSON
- [ ] **Environment variables set**: `.env` contains correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] **Dev server restarted**: After any `.env` changes
- [ ] **Test with example.com**: Successfully analyzes https://example.com
- [ ] **Browser console clear**: No errors in F12 → Console
- [ ] **Network tab shows 200**: F12 → Network tab shows successful POST to edge function

---

## Advanced Troubleshooting

### Check Function Logs

1. Go to Supabase Dashboard → Edge Functions
2. Click on `run-seo-audit` function
3. Click **"Logs"** tab
4. Try running an audit
5. Watch for real-time error messages

**Common log errors:**
- `"Fetch error"`: The target website is blocking requests
- `"Server returned 403"`: Website requires authentication or blocks bots
- `"Timeout"`: Website took longer than 10 seconds to respond
- `"Invalid URL format"`: Check the URL you entered

---

### Test Different URLs

Try these test URLs to isolate the issue:

```bash
# 1. Simple, always-accessible site
https://example.com

# 2. Popular site with good CORS
https://github.com

# 3. Your own website
https://your-site.com
```

**If example.com works but others don't**: The edge function is working correctly. The other sites have protection enabled.

**If nothing works**: The edge function isn't deployed or environment variables are wrong.

---

### Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try running an audit
4. Look for the request to `run-seo-audit`

**What to look for:**
- **Request URL**: Should be `https://YOUR-PROJECT.supabase.co/functions/v1/run-seo-audit`
- **Status Code**:
  - `200` = Success
  - `404` = Function not deployed
  - `401` = Wrong API key
  - `500` = Server error (check function logs)
- **Response**: Should contain JSON with `score`, `issues`, `recommendations`

---

### Clear Browser Cache

Sometimes old code gets cached:

```bash
# Hard refresh in browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# Or clear cache completely:
# Browser Settings → Privacy → Clear Browsing Data → Cached Files
```

---

## Alternative Workarounds

If you need to analyze sites while fixing the edge function:

### Temporary Solution: Use Browser Extension Mode

Some websites allow requests when they think you're a real browser:

1. Open the website in a new tab
2. Right-click → View Page Source
3. Copy all the HTML
4. Create a local HTML file and paste the content
5. Analyze the local file (we can add this feature if needed)

### Install Local Proxy

For advanced users who need to analyze many protected sites:

```bash
# Install a local CORS proxy
npm install -g local-cors-proxy

# Run it
lcp --proxyUrl https://example.com

# Now you can analyze via localhost:8010
```

---

## Prevention & Best Practices

### Regular Maintenance
- **Monitor function status**: Check Supabase Dashboard weekly
- **Test with example.com**: Quick health check of your system
- **Check function logs**: Look for patterns in failures
- **Update function code**: Keep the function code updated

### Before Analyzing a Site
1. Test with https://example.com first
2. Check if the target site has a `robots.txt` that disallows crawling
3. Don't analyze the same site too frequently (respect rate limits)
4. Consider if the site requires JavaScript to render

### When Building Similar Features
- Always deploy edge functions for server-side fetching
- Implement fallback mechanisms gracefully
- Provide clear error messages to users
- Log errors for debugging

---

## Quick Reference Commands

```bash
# Check if function code exists
ls -la supabase/functions/run-seo-audit/

# Check environment variables
cat .env | grep SUPABASE

# Test edge function with curl
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/run-seo-audit \
  -H "Authorization: Bearer YOUR-ANON-KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Run automated test script
./TEST_DEPLOYED_FUNCTIONS.sh

# Restart dev server
npm run dev
```

---

## Getting Additional Help

If you've tried all solutions and still experiencing issues:

1. **Check Function Logs**: Supabase Dashboard → Edge Functions → run-seo-audit → Logs
2. **Check Browser Console**: F12 → Console tab for JavaScript errors
3. **Check Network Tab**: F12 → Network tab for failed requests
4. **Test with curl**: Isolate whether it's a browser or function issue
5. **Try different websites**: Determine if it's site-specific

### Information to Gather for Support

- Supabase project URL (without sensitive keys)
- Function deployment status (screenshot of Dashboard)
- Error message from browser console
- Error message from function logs
- URL you're trying to analyze
- Output from test script

---

## Summary: Most Common Fixes

**90% of issues are solved by:**
1. ✅ Deploying the `run-seo-audit` edge function
2. ✅ Setting correct environment variables in `.env`
3. ✅ Restarting the development server

**5% of issues are:**
4. ✅ Testing with protected websites (try example.com first)

**5% of issues are:**
5. ✅ Network/firewall blocking Supabase requests

Start with Priority 1 (Deploy Edge Function) and work your way down. Most issues are resolved within 5 minutes!
