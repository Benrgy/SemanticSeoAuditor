# Edge Functions Deployment Guide

## Quick Deployment Checklist

- [ ] Deploy `run-seo-audit` function
- [ ] Deploy `semantic-analysis` function
- [ ] Add OpenAI API key to Supabase secrets
- [ ] Test both functions
- [ ] Update frontend integration

---

## Function 1: run-seo-audit

### What it does
Fetches any URL and analyzes it for SEO issues including title tags, meta descriptions, headings, images, structured data, and more.

### Deployment Steps

1. Go to Supabase Dashboard → Edge Functions
2. Click "New Edge Function"
3. Name: `run-seo-audit`
4. Copy the code from: `supabase/functions/run-seo-audit/index.ts`
5. Click "Deploy"

### Test Request

```bash
curl -X POST https://YOUR-PROJECT-REF.supabase.co/functions/v1/run-seo-audit \
  -H "Authorization: Bearer YOUR-ANON-KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Expected Response

```json
{
  "score": 85,
  "issues": [
    {
      "type": "short-title",
      "severity": "medium",
      "description": "Title tag is too short",
      "recommendation": "Expand your title to 50-60 characters"
    }
  ],
  "recommendations": ["Add more internal links", "..."],
  "metadata": {
    "url": "https://example.com",
    "analyzedAt": "2024-01-15T10:30:00Z",
    "responseTime": 245,
    "contentLength": 15234,
    "statusCode": 200
  }
}
```

---

## Function 2: semantic-analysis

### What it does
AI-powered semantic SEO analysis using OpenAI GPT-4. Analyzes content depth, topic relevance, semantic keywords, entities, and provides strategic recommendations.

### Deployment Steps

1. Go to Supabase Dashboard → Edge Functions
2. Click "New Edge Function"
3. Name: `semantic-analysis`
4. Copy the code from: `supabase/functions/semantic-analysis/index.ts`
5. Click "Deploy"

### Configure OpenAI API Key

**REQUIRED:** This function needs an OpenAI API key to work.

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. In Supabase Dashboard → Project Settings → API
3. Scroll to "Edge Function Secrets"
4. Add new secret:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-...` (your OpenAI API key)
5. Save

### Test Request

```bash
curl -X POST https://YOUR-PROJECT-REF.supabase.co/functions/v1/semantic-analysis \
  -H "Authorization: Bearer YOUR-ANON-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "content": "Your website content here...",
    "keywords": ["SEO", "optimization", "ranking"],
    "options": {
      "includeCompetitorAnalysis": true,
      "maxTokens": 1500
    }
  }'
```

### Expected Response

```json
{
  "semanticScore": 78,
  "issues": [
    {
      "title": "Limited Topic Depth",
      "description": "Content lacks comprehensive coverage",
      "severity": "medium",
      "recommendation": "Expand content with related subtopics",
      "priority": "high",
      "implementationSteps": ["Add section on X", "Include Y"],
      "expectedImpact": "Improved topical authority"
    }
  ],
  "recommendations": [
    "Add semantic keyword variations",
    "Implement structured data"
  ],
  "contentAnalysis": {
    "topicRelevance": 82,
    "semanticKeywords": ["optimization", "search engine", "ranking"],
    "contentDepth": 65,
    "entityRecognition": ["Google", "SEO", "algorithm"],
    "readabilityScore": 78
  },
  "competitiveInsights": {
    "contentGaps": ["Missing competitor topic X"],
    "keywordOpportunities": ["long-tail keyword Y"],
    "competitorStrengths": ["Comprehensive guides"]
  },
  "metadata": {
    "processingTime": "2341.23ms",
    "contentLength": 5234,
    "keywordCount": 3,
    "analysisVersion": "2.0"
  }
}
```

---

## Frontend Integration

### Update Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Integration Code Example

```typescript
// Call run-seo-audit
const runAudit = async (url: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-seo-audit`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    }
  );

  return await response.json();
};

// Call semantic-analysis
const runSemanticAnalysis = async (url: string, content: string, keywords: string[]) => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/semantic-analysis`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        content,
        keywords,
        options: {
          includeCompetitorAnalysis: true,
          maxTokens: 1500
        }
      })
    }
  );

  return await response.json();
};
```

---

## Troubleshooting

### Function not found (404)
- Verify function name matches exactly
- Check deployment status in Supabase Dashboard
- Wait 30 seconds after deployment

### CORS errors
- All functions have proper CORS headers configured
- Make sure you're sending the Authorization header

### semantic-analysis returns fallback data
- Check OpenAI API key is set correctly
- Verify you have OpenAI credits available
- Check Supabase logs for detailed error messages

### Timeout errors
- run-seo-audit has 10 second timeout for fetching URLs
- semantic-analysis may take 3-5 seconds for AI processing
- Consider showing loading state in UI

---

## Cost Considerations

### run-seo-audit
- Free - Only uses basic HTTP fetch and regex parsing
- No external API calls

### semantic-analysis
- Uses OpenAI GPT-4 Turbo API
- Approximate cost per request: $0.02-0.04
- Consider implementing caching for repeated URLs
- Monitor OpenAI usage in their dashboard

---

## Next Steps

1. Deploy both functions
2. Test with curl or Postman
3. Integrate into your frontend
4. Add error handling and loading states
5. Consider adding rate limiting for production
6. Set up monitoring and logging

## Support

- Supabase Docs: https://supabase.com/docs/guides/functions
- OpenAI API Docs: https://platform.openai.com/docs
- Edge Functions Logs: Supabase Dashboard → Edge Functions → Logs
