import { Context } from "https://edge.netlify.com/";

interface AuditReport {
  id: string;
  url: string;
  status: string;
  score?: number;
  created_at: string;
  result_json?: {
    score: number;
    technicalSEO?: { score: number };
    onPageSEO?: { score: number };
    semanticSEO?: { score: number };
    contentAnalysis?: {
      topicRelevance: number;
      contentDepth: number;
      readabilityScore: number;
    };
    technicalAnalysis?: {
      coreWebVitals: { lcp: number; fid: number; cls: number };
      mobileScore: number;
    };
  };
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Cache for audit data to reduce database calls
const auditCache = new Map<string, { data: AuditReport | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchAuditReport(auditId: string): Promise<AuditReport | null> {
  // Check cache first
  const cached = auditCache.get(auditId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  if (!SUPABASE_SERVICE_KEY || !SUPABASE_URL) {
    console.error('Supabase environment variables not set');
    return null;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/audits?id=eq.${auditId}&status=eq.completed&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      }
    );

    if (!response.ok) {
      console.error(`Supabase request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const result = data && data.length > 0 ? data[0] : null;
    
    // Cache the result
    auditCache.set(auditId, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error fetching audit report:', error);
    return null;
  }
}

function generateAuditSEOTags(audit: AuditReport): string {
  const score = audit.result_json?.score || audit.score || 0;
  const domain = extractDomain(audit.url);
  const title = `SEO Audit Report for ${domain} - Score: ${score}/100 | Semantic SEO Auditor`;
  const description = generateSmartDescription(audit, domain, score);
  const canonicalUrl = `https://benrgy.github.io/SemanticSeoAuditor/audit/${audit.id}`;
  
  const auditDate = new Date(audit.created_at).toLocaleDateString();
  const scoreCategory = getScoreCategory(score);
  
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <meta name="keywords" content="SEO audit, ${domain}, website analysis, technical SEO, on-page SEO, semantic SEO, ${scoreCategory}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="Semantic SEO Auditor">
    <meta property="og:image" content="https://benrgy.github.io/SemanticSeoAuditor/og-audit-report.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Article specific -->
    <meta property="article:published_time" content="${audit.created_at}">
    <meta property="article:modified_time" content="${audit.created_at}">
    <meta property="article:section" content="SEO Analysis">
    <meta property="article:tag" content="SEO Audit">
    <meta property="article:tag" content="Website Analysis">
    <meta property="article:tag" content="${domain}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:site" content="@SemanticSEO">
    <meta name="twitter:image" content="https://benrgy.github.io/SemanticSeoAuditor/og-audit-report.png">
    
    <!-- Additional SEO -->
    <meta name="author" content="Semantic SEO Auditor">
    <meta name="generator" content="Semantic SEO Auditor">
    <meta name="rating" content="general">
    <meta name="revisit-after" content="7 days">
    
    ${generateStructuredData(audit, canonicalUrl, domain, score)}
  `;
}

function generateSmartDescription(audit: AuditReport, domain: string, score: number): string {
  const scoreCategory = getScoreCategory(score);
  const auditDate = new Date(audit.created_at).toLocaleDateString();
  
  let description = `Comprehensive SEO analysis for ${audit.url}. Overall score: ${score}/100 (${scoreCategory}).`;
  
  // Add specific insights if available
  if (audit.result_json) {
    const insights = [];
    
    if (audit.result_json.technicalSEO) {
      insights.push(`Technical SEO: ${audit.result_json.technicalSEO.score}/100`);
    }
    
    if (audit.result_json.onPageSEO) {
      insights.push(`On-Page SEO: ${audit.result_json.onPageSEO.score}/100`);
    }
    
    if (audit.result_json.semanticSEO) {
      insights.push(`Semantic SEO: ${audit.result_json.semanticSEO.score}/100`);
    }
    
    if (insights.length > 0) {
      description += ` Breakdown: ${insights.join(', ')}.`;
    }
  }
  
  description += ` Analyzed on ${auditDate}. Get actionable recommendations to improve your website's search rankings.`;
  
  return description.substring(0, 160); // Ensure under 160 characters
}

function generateStructuredData(audit: AuditReport, canonicalUrl: string, domain: string, score: number): string {
  const reportSchema = {
    "@context": "https://schema.org",
    "@type": "Report",
    "name": `SEO Audit Report for ${domain}`,
    "description": `Comprehensive SEO analysis with score of ${score}/100`,
    "url": canonicalUrl,
    "dateCreated": audit.created_at,
    "dateModified": audit.created_at,
    "about": {
      "@type": "WebSite",
      "url": audit.url,
      "name": domain
    },
    "author": {
      "@type": "Organization",
      "name": "Semantic SEO Auditor",
      "url": "https://benrgy.github.io/SemanticSeoAuditor"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Semantic SEO Auditor",
      "logo": {
        "@type": "ImageObject",
        "url": "https://benrgy.github.io/SemanticSeoAuditor/logo.png"
      }
    }
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `SEO Performance Metrics for ${domain}`,
    "description": "SEO audit results and performance metrics",
    "url": canonicalUrl,
    "dateCreated": audit.created_at,
    "creator": {
      "@type": "Organization",
      "name": "Semantic SEO Auditor"
    },
    "measurementTechnique": "Automated SEO Analysis",
    "variableMeasured": generateVariableMeasured(audit, score)
  };

  return `
    <!-- Report Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(reportSchema, null, 2)}
    </script>
    
    <!-- Dataset Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(datasetSchema, null, 2)}
    </script>
  `;
}

function generateVariableMeasured(audit: AuditReport, score: number): any[] {
  const variables = [
    {
      "@type": "PropertyValue",
      "name": "Overall SEO Score",
      "value": score,
      "unitText": "points out of 100",
      "description": "Comprehensive SEO performance rating"
    }
  ];

  if (audit.result_json) {
    if (audit.result_json.technicalSEO) {
      variables.push({
        "@type": "PropertyValue",
        "name": "Technical SEO Score",
        "value": audit.result_json.technicalSEO.score,
        "unitText": "points out of 100",
        "description": "Technical website optimization score"
      });
    }

    if (audit.result_json.onPageSEO) {
      variables.push({
        "@type": "PropertyValue",
        "name": "On-Page SEO Score",
        "value": audit.result_json.onPageSEO.score,
        "unitText": "points out of 100",
        "description": "Content and on-page optimization score"
      });
    }

    if (audit.result_json.semanticSEO) {
      variables.push({
        "@type": "PropertyValue",
        "name": "Semantic SEO Score",
        "value": audit.result_json.semanticSEO.score,
        "unitText": "points out of 100",
        "description": "Content semantic relevance score"
      });
    }

    // Add Core Web Vitals if available
    if (audit.result_json.technicalAnalysis?.coreWebVitals) {
      const cwv = audit.result_json.technicalAnalysis.coreWebVitals;
      variables.push(
        {
          "@type": "PropertyValue",
          "name": "Largest Contentful Paint",
          "value": cwv.lcp,
          "unitText": "seconds",
          "description": "Time to render largest content element"
        },
        {
          "@type": "PropertyValue",
          "name": "First Input Delay",
          "value": cwv.fid,
          "unitText": "milliseconds",
          "description": "Time to first user interaction"
        },
        {
          "@type": "PropertyValue",
          "name": "Cumulative Layout Shift",
          "value": cwv.cls,
          "unitText": "score",
          "description": "Visual stability measurement"
        }
      );
    }
  }

  return variables;
}

function getScoreCategory(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 60) return "Poor";
  return "Needs Improvement";
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  }
}

function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isCrawler(userAgent: string): boolean {
  const crawlerPatterns = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
    'facebookexternalhit', 'twitterbot', 'rogerbot', 'linkedinbot', 'embedly',
    'quora link preview', 'showyoubot', 'outbrain', 'pinterest/0.',
    'developers.google.com/+/web/snippet', 'slackbot', 'vkshare', 'w3c_validator',
    'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr', 'bitlybot',
    'skypeuripreview', 'nuzzel', 'discordbot', 'google page speed', 'qwantify',
    'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot'
  ];
  
  const ua = userAgent.toLowerCase();
  return crawlerPatterns.some(pattern => ua.includes(pattern));
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // Only process audit report routes
  if (!pathname.startsWith('/audit/') || pathname === '/audit' || pathname === '/audit/') {
    return context.next();
  }

  // Only enhance for crawlers and social media bots
  if (!isCrawler(userAgent)) {
    return context.next();
  }

  const auditId = pathname.replace('/audit/', '');
  
  // Validate audit ID format
  if (!auditId || auditId.length < 5 || auditId.includes('/')) {
    return context.next();
  }

  try {
    const audit = await fetchAuditReport(auditId);
    
    if (!audit) {
      // Return enhanced 404 page for missing audits
      const response = await context.next();
      const html = await response.text();
      
      const notFoundSEO = `
        <title>SEO Audit Report Not Found - Semantic SEO Auditor</title>
        <meta name="description" content="The requested SEO audit report could not be found. Run a new audit to get comprehensive SEO insights for your website.">
        <meta name="robots" content="noindex, follow">
        <link rel="canonical" href="https://benrgy.github.io/SemanticSeoAuditor/">
      `;
      
      const modifiedHtml = html.replace(
        /<head[^>]*>[\s\S]*?<\/head>/i,
        `<head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="image/svg+xml" href="../vite.svg" />
          ${notFoundSEO}
        </head>`
      );

      return new Response(modifiedHtml, {
        status: 404,
        headers: {
          ...Object.fromEntries(response.headers),
          'content-type': 'text/html; charset=utf-8',
        },
      });
    }

    const response = await context.next();
    const html = await response.text();
    const seoTags = generateAuditSEOTags(audit);
    
    // Replace the entire head section with enhanced SEO
    const modifiedHtml = html.replace(
      /<head[^>]*>[\s\S]*?<\/head>/i,
      `<head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="../vite.svg" />
        ${seoTags}
      </head>`
    );

    return new Response(modifiedHtml, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=3600', // 5 min browser, 1 hour CDN
        'x-seo-enhanced': 'true'
      },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    // Fallback to normal response on error
    return context.next();
  }
};