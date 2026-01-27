# Deploy Updated Edge Function

## Critical: SSRF Protection Added

The `run-seo-audit` edge function has been updated with SSRF protection but requires deployment.

## What Was Added

### Security Improvements
- Blocks private IP addresses (10.x, 172.16-31.x, 192.168.x, 169.254.x)
- Blocks localhost and loopback addresses
- Blocks IPv6 private ranges
- Blocks .local and .internal domains
- Only allows HTTP/HTTPS protocols

### Code Changes
Location: `supabase/functions/run-seo-audit/index.ts`

```typescript
// New validation code added (lines 277-304)
const blockedHosts = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::]',
];

const blockedPatterns = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^fc00:/,
  /^fe80:/,
  /^ff00:/,
];

if (blockedHosts.includes(hostname) ||
    blockedPatterns.some(pattern => pattern.test(hostname))) {
  throw new Error('Private IP addresses are not allowed');
}

if (hostname.endsWith('.local') || hostname.endsWith('.internal')) {
  throw new Error('Local domains are not allowed');
}
```

## Deployment Options

### Option 1: Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard
2. Select your project: `zaisbrmgprltcf`
3. Navigate to Edge Functions
4. Find `run-seo-audit` function
5. Click "Edit" or "Update"
6. Copy the contents of `supabase/functions/run-seo-audit/index.ts`
7. Paste into the editor
8. Click "Deploy"

### Option 2: Supabase CLI
If you have Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref zaisbrmgprltcf

# Deploy the function
supabase functions deploy run-seo-audit

# Verify deployment
supabase functions list
```

### Option 3: GitHub Actions (Automated)
Create `.github/workflows/deploy-functions.yml`:

```yaml
name: Deploy Edge Functions

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Deploy Functions
        run: |
          supabase functions deploy run-seo-audit --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## Verification

After deployment, test the SSRF protection:

### Test 1: Should Block Private IPs
```bash
# This should fail with "Private IP addresses are not allowed"
curl -X POST https://zaisbrmgprltcf.supabase.co/functions/v1/run-seo-audit \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1"}'
```

Expected response:
```json
{
  "error": "Invalid URL",
  "details": "Private IP addresses are not allowed"
}
```

### Test 2: Should Block Localhost
```bash
# This should fail
curl -X POST https://zaisbrmgprltcf.supabase.co/functions/v1/run-seo-audit \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://localhost:3000"}'
```

### Test 3: Should Allow Public URLs
```bash
# This should work
curl -X POST https://zaisbrmgprltcf.supabase.co/functions/v1/run-seo-audit \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

Expected response:
```json
{
  "score": 85,
  "issues": [...],
  "recommendations": [...],
  "metadata": {...}
}
```

## Troubleshooting

### Error: "Not authorized"
- Check your Supabase anon key is correct
- Verify the project URL is correct

### Error: "Function not found"
- Ensure the function is deployed
- Check the function name matches exactly: `run-seo-audit`

### Error: "Cannot read properties of undefined"
- Check the function code was copied completely
- Verify no syntax errors in the editor

## Monitoring

After deployment, monitor:
1. Function invocation count (Supabase Dashboard → Edge Functions → Metrics)
2. Error rate (should be low)
3. Response times (should be <2 seconds for most sites)
4. Blocked requests (verify SSRF protection is working)

## Rollback

If issues occur after deployment:

### Via Dashboard
1. Go to Edge Functions → run-seo-audit
2. Click "Version History"
3. Select previous version
4. Click "Restore"

### Via CLI
```bash
# List previous versions
supabase functions list --project-ref zaisbrmgprltcf

# Deploy specific version
supabase functions deploy run-seo-audit --version <VERSION>
```

## Next Steps

After deploying the edge function:
1. Test thoroughly with various URLs
2. Monitor for any errors
3. Implement rate limiting (see PRODUCTION_READY.md)
4. Update RLS policies for anonymous audits

## Support

If deployment fails:
- Check Supabase status: https://status.supabase.com
- Review function logs in Supabase Dashboard
- Check the function size (must be <10MB)
- Verify all imports are using npm: or jsr: specifiers

---

**File Updated**: `supabase/functions/run-seo-audit/index.ts`
**Lines Changed**: 270-319 (added SSRF protection)
**Status**: Ready to deploy ✅
