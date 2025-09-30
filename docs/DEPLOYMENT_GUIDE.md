# Deployment Guide - Dynamic Meta Tag Injection

## Overview

This application uses **Netlify Edge Functions** to provide dynamic SEO optimization with database integration. The system fetches audit data from Supabase and generates unique meta tags for each audit report.

## Prerequisites

### Technical Requirements
- ✅ React SPA with React Router DOM
- ✅ Supabase database with audit data
- ✅ Netlify hosting account
- ✅ Environment variables configured

### Access Requirements
- Supabase Service Role Key (not anon key)
- Netlify deployment permissions
- Admin access to Netlify dashboard

## Environment Variables Setup

### Required Variables

Set these in your Netlify dashboard → Site settings → Environment variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key
```

### Getting Your Service Role Key

1. Go to Supabase dashboard → Settings → API
2. Copy the `service_role` secret key (NOT the anon key)
3. This key has full database access and bypasses RLS

## Edge Functions Implementation

### 1. Audit SEO Function (`audit-seo.ts`)

**Purpose**: Generates dynamic SEO for audit report pages

**Features**:
- Fetches audit data from Supabase
- Creates unique titles with domain and score
- Generates comprehensive meta descriptions
- Adds structured data for rich snippets
- Handles missing audits with proper 404 SEO

**Route**: `/audit/*`

### 2. General SEO Function (`general-seo.ts`)

**Purpose**: Handles static page SEO optimization

**Features**:
- Route-specific meta tags
- Open Graph optimization
- Twitter Card support
- Structured data for web application

**Route**: `/*` (excluding `/audit/*`)

## Database Schema Requirements

Your Supabase `audits` table should include:

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  status TEXT NOT NULL,
  score INTEGER,
  result_json JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment Process

### 1. Build Configuration

The `build:netlify` script:
- Builds the React application
- Copies netlify.toml to dist folder
- Copies edge functions to dist/netlify folder

### 2. Deploy to Netlify

```bash
# Option 1: Automatic (recommended)
git push origin main  # Triggers auto-deploy

# Option 2: Manual
npm run build:netlify
# Upload dist folder to Netlify
```

### 3. Configure Environment Variables

In Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy the site

## Testing the Implementation

### 1. Test Crawler Detection

```bash
# Test with Googlebot user agent
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
     https://your-site.netlify.app/audit/some-audit-id

# Should return enhanced HTML with dynamic meta tags
```

### 2. Test Social Media

- **Facebook**: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)

### 3. Verify Database Connection

Check Netlify function logs:
1. Go to Netlify dashboard → Functions
2. Click on `audit-seo` function
3. View logs for any database connection errors

## Expected Results

### For Audit Reports (`/audit/123`)

Crawlers receive:
```html
<title>SEO Audit Report for example.com - Score: 85/100 | Semantic SEO Auditor</title>
<meta name="description" content="Comprehensive SEO analysis for https://example.com. Overall score: 85/100. Technical, on-page, and semantic SEO insights with actionable recommendations.">
<meta property="og:title" content="SEO Audit Report for example.com - Score: 85/100 | Semantic SEO Auditor">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Report",
  "name": "SEO Audit Report for example.com - Score: 85/100",
  ...
}
</script>
```

### For Static Pages

Each page gets unique, optimized meta tags based on route configuration.

## Performance Metrics

- **Edge Processing**: 50-200ms additional latency
- **Cache Duration**: 5 minutes for dynamic content, 1 hour for CDN
- **Database Queries**: Only for crawler requests
- **User Impact**: Zero (React app functions normally)

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   ```
   Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set
   ```
   **Solution**: Add environment variables in Netlify dashboard

2. **Database Connection Failed**
   ```
   Error: Supabase request failed: 401
   ```
   **Solution**: Verify service role key is correct

3. **Edge Function Not Triggering**
   ```
   Meta tags not appearing for crawlers
   ```
   **Solution**: Check netlify.toml configuration and redeploy

### Debug Tools

- **Netlify Function Logs**: Monitor edge function execution
- **Browser DevTools**: Inspect meta tags in development
- **Curl Commands**: Test crawler-specific responses

## Security Considerations

- Service role key has full database access
- Only use for server-side operations
- Never expose in client-side code
- Consider creating a read-only database role for production

## Monitoring

### Key Metrics to Track

- Edge function execution time
- Database query performance
- Crawler request volume
- SEO improvement metrics

### Tools

- Netlify Analytics for function performance
- Google Search Console for SEO metrics
- Supabase dashboard for database monitoring

This implementation provides enterprise-grade SEO optimization while maintaining the performance and developer experience of your React SPA.