# Frontend Integration Guide

Complete guide for integrating the deployed edge functions into your React application.

## Prerequisites

- Edge functions deployed in Supabase Dashboard
- OpenAI API key configured (for semantic-analysis)
- Environment variables set in `.env`

---

## Step 1: Create API Service

Create a centralized service for calling edge functions:

**File: `src/services/edgeFunctions.ts`**

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface AuditIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  element?: string;
  recommendation?: string;
}

interface AuditResult {
  score: number;
  issues: AuditIssue[];
  recommendations: string[];
  metadata: {
    url: string;
    analyzedAt: string;
    responseTime: number;
    contentLength: number;
    statusCode: number;
  };
}

interface SemanticAnalysisResult {
  semanticScore: number;
  issues: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
    implementationSteps: string[];
    expectedImpact: string;
  }>;
  recommendations: string[];
  contentAnalysis: {
    topicRelevance: number;
    semanticKeywords: string[];
    contentDepth: number;
    entityRecognition: string[];
    readabilityScore: number;
  };
  competitiveInsights?: {
    contentGaps: string[];
    keywordOpportunities: string[];
    competitorStrengths: string[];
  };
  metadata?: {
    processingTime: string;
    contentLength: number;
    keywordCount: number;
    analysisVersion: string;
  };
}

export const runSEOAudit = async (url: string): Promise<AuditResult> => {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/run-seo-audit`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run SEO audit');
  }

  return await response.json();
};

export const runSemanticAnalysis = async (
  url: string,
  content: string,
  keywords: string[],
  options?: {
    includeCompetitorAnalysis?: boolean;
    includeContentGaps?: boolean;
    includeEntityAnalysis?: boolean;
    maxTokens?: number;
  }
): Promise<SemanticAnalysisResult> => {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/semantic-analysis`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        content,
        keywords,
        options: options || {
          includeCompetitorAnalysis: true,
          maxTokens: 1500,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run semantic analysis');
  }

  return await response.json();
};
```

---

## Step 2: Update Audit Form Component

Integrate the edge functions into your existing audit form:

**File: `src/components/AuditForm.tsx`** (modifications)

```typescript
import { runSEOAudit, runSemanticAnalysis } from '../services/edgeFunctions';

// Inside your component:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!url) return;

  setIsLoading(true);
  setError(null);

  try {
    // Run basic SEO audit
    const auditResult = await runSEOAudit(url);

    // Optionally fetch page content and run semantic analysis
    const response = await fetch(url);
    const html = await response.text();

    // Extract text content (simplified)
    const textContent = html.replace(/<[^>]*>/g, ' ').trim();

    const semanticResult = await runSemanticAnalysis(
      url,
      textContent,
      ['SEO', 'optimization'], // Add your target keywords
      {
        includeCompetitorAnalysis: true,
        maxTokens: 1500,
      }
    );

    // Combine results and navigate to report
    navigate('/report', {
      state: {
        audit: auditResult,
        semantic: semanticResult,
      },
    });

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to analyze URL');
  } finally {
    setIsLoading(false);
  }
};
```

---

## Step 3: Display Results in Audit Report

Update your audit report page to show both results:

**File: `src/pages/AuditReport.tsx`** (additions)

```typescript
import { useLocation } from 'react-router-dom';

export default function AuditReport() {
  const location = useLocation();
  const { audit, semantic } = location.state || {};

  if (!audit) {
    return <div>No audit data available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Basic SEO Score */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">SEO Score</h2>
        <div className="text-6xl font-bold text-blue-600">
          {audit.score}/100
        </div>
      </Card>

      {/* SEO Issues */}
      <Card className="mb-6">
        <h3 className="text-xl font-bold mb-4">Issues Found</h3>
        <div className="space-y-3">
          {audit.issues.map((issue, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                issue.severity === 'high'
                  ? 'border-red-500 bg-red-50'
                  : issue.severity === 'medium'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="font-semibold">{issue.description}</div>
              {issue.recommendation && (
                <div className="text-sm mt-1">{issue.recommendation}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Semantic Analysis (if available) */}
      {semantic && (
        <>
          <Card className="mb-6">
            <h3 className="text-xl font-bold mb-4">Semantic SEO Score</h3>
            <div className="text-5xl font-bold text-green-600">
              {semantic.semanticScore}/100
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Topic Relevance</div>
                <div className="text-2xl font-bold">
                  {semantic.contentAnalysis.topicRelevance}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Content Depth</div>
                <div className="text-2xl font-bold">
                  {semantic.contentAnalysis.contentDepth}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Readability</div>
                <div className="text-2xl font-bold">
                  {semantic.contentAnalysis.readabilityScore}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Keywords</div>
                <div className="text-2xl font-bold">
                  {semantic.contentAnalysis.semanticKeywords.length}
                </div>
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-xl font-bold mb-4">Semantic Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {semantic.contentAnalysis.semanticKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-xl font-bold mb-4">Recognized Entities</h3>
            <div className="flex flex-wrap gap-2">
              {semantic.contentAnalysis.entityRecognition.map((entity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {entity}
                </span>
              ))}
            </div>
          </Card>

          {semantic.competitiveInsights && (
            <Card className="mb-6">
              <h3 className="text-xl font-bold mb-4">Competitive Insights</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Content Gaps</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {semantic.competitiveInsights.contentGaps.map((gap, index) => (
                      <li key={index} className="text-sm">{gap}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Keyword Opportunities</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {semantic.competitiveInsights.keywordOpportunities.map((keyword, index) => (
                      <li key={index} className="text-sm">{keyword}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Recommendations */}
      <Card>
        <h3 className="text-xl font-bold mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {audit.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>

        {semantic && (
          <>
            <h4 className="font-semibold mt-6 mb-3">Semantic SEO Recommendations</h4>
            <ul className="space-y-2">
              {semantic.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}
```

---

## Step 4: Add Loading States

Create a loading component for better UX:

**File: `src/components/LoadingSpinner.tsx`**

```typescript
export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
}
```

Use it in your forms:

```typescript
{isLoading && (
  <LoadingSpinner message="Analyzing your website..." />
)}
```

---

## Step 5: Add Error Handling

Create an error display component:

**File: `src/components/ErrorMessage.tsx`**

```typescript
export default function ErrorMessage({
  error,
  onRetry
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <span className="text-red-500 mr-3 text-xl">⚠</span>
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold">Error</h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Functions deployed and accessible
- [ ] Environment variables configured
- [ ] Basic audit works with valid URLs
- [ ] Semantic analysis returns results (check OpenAI credits)
- [ ] Error handling works for invalid URLs
- [ ] Loading states display correctly
- [ ] Results display properly in report
- [ ] CORS works (no console errors)

---

## Common Issues

### "Failed to fetch"
- Check environment variables are set
- Verify function names match exactly
- Check browser console for CORS errors

### "OpenAI API error"
- Verify API key is set in Supabase
- Check OpenAI account has available credits
- Review function logs in Supabase Dashboard

### Slow performance
- semantic-analysis can take 3-5 seconds
- Consider showing progress indicator
- Cache results in database for repeated URLs

---

## Next Enhancements

1. **Caching**: Store audit results in Supabase database
2. **Rate Limiting**: Prevent abuse of OpenAI API
3. **Background Jobs**: Queue long-running analyses
4. **Webhooks**: Get notified when analysis completes
5. **PDF Reports**: Generate downloadable reports
6. **Historical Tracking**: Track score changes over time
