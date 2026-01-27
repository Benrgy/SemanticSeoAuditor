# Manual Edge Function Deployment Guide

Your edge functions are ready to deploy! Follow these steps to deploy them to Supabase.

## Prerequisites

- Supabase account with project ID: `zaisbrmgprltcf`
- Access to your Supabase dashboard

## Step 1: Deploy `run-seo-audit` Function

1. Go to https://supabase.com/dashboard/project/zaisbrmgprltcf/functions
2. Click "Create Function" or "New Function"
3. Name it: `run-seo-audit`
4. Copy the entire contents from: `supabase/functions/run-seo-audit/index.ts`
5. Paste into the function editor
6. Click "Deploy"

## Step 2: Deploy `semantic-analysis` Function

1. Stay on https://supabase.com/dashboard/project/zaisbrmgprltcf/functions
2. Click "Create Function" or "New Function"
3. Name it: `semantic-analysis`
4. Copy the entire contents from: `supabase/functions/semantic-analysis/index.ts`
5. Paste into the function editor
6. Click "Deploy"

## Step 3: Set Environment Variables (for semantic-analysis)

The `semantic-analysis` function requires an OpenAI API key:

1. Go to Edge Functions settings in your Supabase dashboard
2. Click on "semantic-analysis" function
3. Add environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
4. Save

**Note:** If you don't have an OpenAI API key, the function will use fallback analysis.

## Step 4: Test Your Functions

### Test `run-seo-audit`:

```bash
curl -X POST \
  'https://zaisbrmgprltcfxvgfsupabase.co/functions/v1/run-seo-audit' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'
```

### Test `semantic-analysis`:

```bash
curl -X POST \
  'https://zaisbrmgprltcfxvgfsupabase.co/functions/v1/semantic-analysis' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com", "content": "Sample content for analysis", "keywords": ["SEO", "optimization"]}'
```

## Function Details

### `run-seo-audit`
- **Purpose:** Analyzes a URL for SEO issues
- **Input:** `{ "url": "https://example.com" }`
- **Output:** Audit results with score, issues, and recommendations
- **No external dependencies required**

### `semantic-analysis`
- **Purpose:** Performs advanced semantic SEO analysis
- **Input:** `{ "url": "...", "content": "...", "keywords": [...] }`
- **Output:** Semantic analysis with AI-powered insights
- **Requires:** OPENAI_API_KEY environment variable (optional, has fallback)

## Verification

After deployment, your application should be able to:
1. Run SEO audits on any public URL
2. Get semantic analysis on content
3. See results in your dashboard

## Troubleshooting

### Function not found (404)
- Verify function names match exactly: `run-seo-audit` and `semantic-analysis`
- Check that functions are deployed and active in dashboard

### CORS errors
- Both functions have CORS headers configured
- Verify your frontend is sending requests correctly

### Semantic analysis returns fallback results
- This means OPENAI_API_KEY is not set or invalid
- Add the key in function environment variables

### Timeout errors
- The `run-seo-audit` function has a 10-second timeout
- Ensure the target URL responds within this timeframe

## Next Steps

Once deployed:
1. Test both functions using the curl commands above
2. Visit your application and try running an audit
3. Check the Supabase logs if you encounter errors
4. Monitor function invocations in your dashboard

---

Your functions are production-ready and include:
- Full CORS support
- Error handling
- Input validation
- Security checks (blocks private IPs)
- Comprehensive SEO analysis
