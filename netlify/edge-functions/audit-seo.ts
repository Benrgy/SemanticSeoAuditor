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
  };
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function fetchAuditReport(auditId: string): Promise<AuditReport | null> {
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
      }
    );

    if (!response.ok) {
      console.error(`Supabase request failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching audit report:', error);
    return null;
  }
}

function generateAuditSEOTags(audit: AuditReport): string {
  const score = audit.result_json?.score || audit.score || 0;
  const domain = extractDomain(audit.url);
  const title = `SEO Audit Report for ${domain} - Score: ${score}/100 | Semantic SEO Auditor`;
  const description = `Comprehensive SEO analysis for ${audit.url}. Overall score: ${score}/100. Technical, on-page, and semantic SEO insights with actionable recommendations.`;
  const canonicalUrl = `https://benrgy.github.io/SemanticSeoAuditor/audit/${audit.id}`;
  
  const scoreColor = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement';
  const auditDate = new Date(audit.created_at).toLocaleDateString();
  
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
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
    <meta name="keywords" content="SEO audit, ${domain}, website analysis, technical SEO, on-page SEO, semantic SEO">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Report",
      "name": "${escapeHtml(title.replace(' | Semantic SEO Auditor', ''))}",
      "description": "${escapeHtml(description)}",
      "url": "${canonicalUrl}",
      "dateCreated": "${audit.created_at}",
      "about": {
        "@type": "WebSite",
        "url": "${escapeHtml(audit.url)}",
        "name": "${escapeHtml(domain)}"
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
      },
      "mainEntity": {
        "@type": "AnalysisNewsArticle",
        "headline": "SEO Analysis Report",
        "description": "Comprehensive SEO audit results",
        "datePublished": "${audit.created_at}",
        "author": {
          "@type": "Organization",
          "name": "Semantic SEO Auditor"
        }
      }
    }
    </script>
    
    <!-- Performance Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "SEO Performance Metrics for ${escapeHtml(domain)}",
      "description": "SEO audit results and performance metrics",
      "url": "${canonicalUrl}",
      "dateCreated": "${audit.created_at}",
      "creator": {
        "@type": "Organization",
        "name": "Semantic SEO Auditor"
      },
      "measurementTechnique": "Automated SEO Analysis",
      "variableMeasured": [
        {
          "@type": "PropertyValue",
          "name": "Overall SEO Score",
          "value": "${score}",
          "unitText": "points out of 100"
        }
        ${audit.result_json?.technicalSEO ? `,{
          "@type": "PropertyValue",
          "name": "Technical SEO Score",
          "value": "${audit.result_json.technicalSEO.score}",
          "unitText": "points out of 100"
        }` : ''}
        ${audit.result_json?.onPageSEO ? `,{
          "@type": "PropertyValue",
          "name": "On-Page SEO Score", 
          "value": "${audit.result_json.onPageSEO.score}",
          "unitText": "points out of 100"
        }` : ''}
        ${audit.result_json?.semanticSEO ? `,{
          "@type": "PropertyValue",
          "name": "Semantic SEO Score",
          "value": "${audit.result_json.semanticSEO.score}",
          "unitText": "points out of 100"
        }` : ''}
      ]
    }
    </script>
  `;
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
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest/0.',
    'developers.google.com/+/web/snippet',
    'slackbot',
    'vkshare',
    'w3c_validator',
    'redditbot',
    'applebot',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'google page speed',
    'qwantify'
  ];
  
  const ua = userAgent.toLowerCase();
  return crawlerPatterns.some(pattern => ua.includes(pattern));
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // Only process audit report routes for crawlers
  if (!pathname.startsWith('/audit/') || pathname === '/audit' || pathname === '/audit/') {
    return context.next();
  }

  // Only enhance for crawlers and social media bots
  if (!isCrawler(userAgent)) {
    return context.next();
  }

  const auditId = pathname.replace('/audit/', '');
  
  // Skip if audit ID is invalid
  if (!auditId || auditId.length < 10) {
    return context.next();
  }

  const audit = await fetchAuditReport(auditId);
  
  if (!audit) {
    // Return enhanced 404 page for missing audits
    const response = await context.next();
    const html = await response.text();
    
    const notFoundSEO = `
      <title>SEO Audit Report Not Found - Semantic SEO Auditor</title>
      <meta name="description" content="The requested SEO audit report could not be found. Run a new audit to get comprehensive SEO insights for your website.">
      <meta name="robots" content="noindex, follow">
    `;
    
    const modifiedHtml = html.replace(
      /<title>.*?<\/title>/i,
      notFoundSEO
    );

    return new Response(modifiedHtml, {
      status: 404,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html',
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
      'cache-control': 'public, max-age=300, s-maxage=3600'
    },
  });
};