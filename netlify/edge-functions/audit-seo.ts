import { Context } from "https://edge.netlify.com/";

interface AuditReport {
  id: string;
  url: string;
  status: string;
  score?: number;
  created_at: string;
  result_json?: {
    score: number;
    technicalSEO?: { score: number; issues?: any[] };
    onPageSEO?: { score: number; issues?: any[] };
    semanticSEO?: { score: number; issues?: any[] };
    contentAnalysis?: {
      topicRelevance: number;
      contentDepth: number;
      readabilityScore: number;
      entityRecognition: string[];
      semanticKeywords: string[];
    };
    technicalAnalysis?: {
      coreWebVitals: { lcp: number; fid: number; cls: number };
      mobileScore: number;
      schemaMarkup: string[];
      internalLinks: number;
    };
    competitiveAnalysis?: {
      contentGaps: string[];
      keywordOpportunities: string[];
      competitorStrengths: string[];
    };
  };
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Enhanced caching with TTL and size limits
const auditCache = new Map<string, { 
  data: AuditReport | null; 
  timestamp: number; 
  hits: number;
  lastAccessed: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000; // Maximum cached items
const CACHE_CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Periodic cache cleanup
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(auditCache.entries());
  
  // Remove expired entries
  entries.forEach(([key, value]) => {
    if (now - value.timestamp > CACHE_DURATION) {
      auditCache.delete(key);
    }
  });
  
  // If still over limit, remove least recently used
  if (auditCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = entries
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
      .slice(0, auditCache.size - MAX_CACHE_SIZE);
    
    sortedEntries.forEach(([key]) => auditCache.delete(key));
  }
}, CACHE_CLEANUP_INTERVAL);

async function fetchAuditReport(auditId: string): Promise<AuditReport | null> {
  // Enhanced cache check with hit tracking
  const cached = auditCache.get(auditId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    cached.hits++;
    cached.lastAccessed = Date.now();
    console.log(`Cache hit for audit ${auditId} (${cached.hits} hits)`);
    return cached.data;
  }

  if (!SUPABASE_SERVICE_KEY || !SUPABASE_URL) {
    console.error('Supabase environment variables not configured');
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    console.log(`Fetching audit ${auditId} from database`);
    const startTime = performance.now();
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/audits?id=eq.${auditId}&status=eq.completed&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal', // Reduce response size
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    const fetchTime = performance.now() - startTime;
    
    if (!response.ok) {
      console.error(`Supabase request failed: ${response.status} ${response.statusText} (${fetchTime.toFixed(2)}ms)`);
      return null;
    }

    const data = await response.json();
    const result = data && data.length > 0 ? data[0] : null;
    
    // Enhanced cache storage with metadata
    auditCache.set(auditId, { 
      data: result, 
      timestamp: Date.now(),
      hits: 1,
      lastAccessed: Date.now()
    });
    
    console.log(`Database fetch completed in ${fetchTime.toFixed(2)}ms for audit ${auditId}`);
    return result;
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`Database request timeout for audit ${auditId}`);
    } else {
      console.error(`Error fetching audit ${auditId}:`, error);
    }
    return null;
  }
}

function generateAdvancedSEOTags(audit: AuditReport): string {
  const score = audit.result_json?.score || audit.score || 0;
  const domain = extractDomain(audit.url);
  const auditDate = new Date(audit.created_at);
  const scoreCategory = getScoreCategory(score);
  
  // Enhanced title generation
  const title = generateSmartTitle(audit, domain, score, scoreCategory);
  const description = generateIntelligentDescription(audit, domain, score, scoreCategory);
  const canonicalUrl = `https://benrgy.github.io/SemanticSeoAuditor/audit/${audit.id}`;
  
  // Generate keywords based on audit data
  const keywords = generateDynamicKeywords(audit, domain, scoreCategory);
  
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Enhanced Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="Semantic SEO Auditor">
    <meta property="og:image" content="https://benrgy.github.io/SemanticSeoAuditor/og-audit-report.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="SEO Audit Report for ${domain} - Score: ${score}/100">
    <meta property="og:locale" content="en_US">
    
    <!-- Article specific metadata -->
    <meta property="article:published_time" content="${audit.created_at}">
    <meta property="article:modified_time" content="${audit.created_at}">
    <meta property="article:section" content="SEO Analysis">
    <meta property="article:tag" content="SEO Audit">
    <meta property="article:tag" content="Website Analysis">
    <meta property="article:tag" content="${domain}">
    <meta property="article:tag" content="${scoreCategory}">
    
    <!-- Enhanced Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:site" content="@SemanticSEO">
    <meta name="twitter:creator" content="@SemanticSEO">
    <meta name="twitter:image" content="https://benrgy.github.io/SemanticSeoAuditor/og-audit-report.png">
    <meta name="twitter:image:alt" content="SEO Audit Report for ${domain}">
    
    <!-- Additional SEO metadata -->
    <meta name="author" content="Semantic SEO Auditor">
    <meta name="generator" content="Semantic SEO Auditor v2.0">
    <meta name="rating" content="general">
    <meta name="revisit-after" content="7 days">
    <meta name="distribution" content="global">
    <meta name="language" content="en">
    <meta name="geo.region" content="US">
    <meta name="geo.placename" content="United States">
    
    <!-- Performance and technical metadata -->
    <meta name="theme-color" content="#1f2937">
    <meta name="msapplication-TileColor" content="#1f2937">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="format-detection" content="telephone=no">
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://benrgy.github.io">
    
    ${generateAdvancedStructuredData(audit, canonicalUrl, domain, score)}
  `;
}

function generateSmartTitle(audit: AuditReport, domain: string, score: number, category: string): string {
  const baseTitle = `SEO Audit Report for ${domain}`;
  const scoreInfo = `Score: ${score}/100`;
  const categoryInfo = `(${category})`;
  
  // Optimize for 60 character limit
  const fullTitle = `${baseTitle} - ${scoreInfo} ${categoryInfo} | Semantic SEO Auditor`;
  
  if (fullTitle.length <= 60) {
    return fullTitle;
  }
  
  // Fallback to shorter version
  return `${baseTitle} - ${scoreInfo} | SEO Auditor`;
}

function generateIntelligentDescription(audit: AuditReport, domain: string, score: number, category: string): string {
  const auditDate = new Date(audit.created_at).toLocaleDateString();
  let description = `Comprehensive SEO analysis for ${audit.url}. Overall score: ${score}/100 (${category}).`;
  
  // Add specific insights if available
  if (audit.result_json) {
    const insights = [];
    
    if (audit.result_json.technicalSEO) {
      insights.push(`Technical: ${audit.result_json.technicalSEO.score}/100`);
    }
    
    if (audit.result_json.onPageSEO) {
      insights.push(`On-Page: ${audit.result_json.onPageSEO.score}/100`);
    }
    
    if (audit.result_json.semanticSEO) {
      insights.push(`Semantic: ${audit.result_json.semanticSEO.score}/100`);
    }
    
    if (insights.length > 0) {
      description += ` Breakdown: ${insights.join(', ')}.`;
    }
    
    // Add performance insights
    if (audit.result_json.technicalAnalysis?.coreWebVitals) {
      const cwv = audit.result_json.technicalAnalysis.coreWebVitals;
      if (cwv.lcp > 2.5) {
        description += ` Performance needs improvement.`;
      } else {
        description += ` Good performance metrics.`;
      }
    }
  }
  
  description += ` Analyzed on ${auditDate}. Get actionable recommendations to improve search rankings.`;
  
  // Ensure under 160 characters
  return description.length > 160 ? description.substring(0, 157) + '...' : description;
}

function generateDynamicKeywords(audit: AuditReport, domain: string, category: string): string {
  const baseKeywords = [
    'SEO audit',
    domain,
    'website analysis',
    'technical SEO',
    'on-page SEO',
    'semantic SEO',
    category.toLowerCase()
  ];
  
  // Add dynamic keywords based on audit data
  if (audit.result_json?.contentAnalysis?.semanticKeywords) {
    baseKeywords.push(...audit.result_json.contentAnalysis.semanticKeywords.slice(0, 3));
  }
  
  if (audit.result_json?.technicalAnalysis?.schemaMarkup) {
    baseKeywords.push('structured data', 'schema markup');
  }
  
  if (audit.result_json?.competitiveAnalysis?.keywordOpportunities) {
    baseKeywords.push(...audit.result_json.competitiveAnalysis.keywordOpportunities.slice(0, 2));
  }
  
  return baseKeywords.join(', ');
}

function generateAdvancedStructuredData(audit: AuditReport, canonicalUrl: string, domain: string, score: number): string {
  const auditDate = audit.created_at;
  
  // Main Report Schema
  const reportSchema = {
    "@context": "https://schema.org",
    "@type": "Report",
    "name": `SEO Audit Report for ${domain}`,
    "description": `Comprehensive SEO analysis with overall score of ${score}/100`,
    "url": canonicalUrl,
    "dateCreated": auditDate,
    "dateModified": auditDate,
    "inLanguage": "en-US",
    "about": {
      "@type": "WebSite",
      "url": audit.url,
      "name": domain,
      "description": `Website analysis and SEO audit for ${domain}`
    },
    "author": {
      "@type": "Organization",
      "name": "Semantic SEO Auditor",
      "url": "https://benrgy.github.io/SemanticSeoAuditor",
      "logo": {
        "@type": "ImageObject",
        "url": "https://benrgy.github.io/SemanticSeoAuditor/logo.png"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Semantic SEO Auditor",
      "url": "https://benrgy.github.io/SemanticSeoAuditor",
      "logo": {
        "@type": "ImageObject",
        "url": "https://benrgy.github.io/SemanticSeoAuditor/logo.png",
        "width": 200,
        "height": 60
      }
    }
  };

  // Dataset Schema for SEO Metrics
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `SEO Performance Metrics for ${domain}`,
    "description": "Comprehensive SEO audit results and performance metrics",
    "url": canonicalUrl,
    "dateCreated": auditDate,
    "dateModified": auditDate,
    "creator": {
      "@type": "Organization",
      "name": "Semantic SEO Auditor"
    },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "measurementTechnique": "Automated SEO Analysis with AI-powered insights",
    "variableMeasured": generateVariableMeasured(audit, score)
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `SEO Audit Report for ${domain}`,
    "description": `Detailed SEO analysis and recommendations for ${domain}`,
    "url": canonicalUrl,
    "datePublished": auditDate,
    "dateModified": auditDate,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Semantic SEO Auditor",
      "url": "https://benrgy.github.io/SemanticSeoAuditor"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://benrgy.github.io/SemanticSeoAuditor"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "SEO Audit Report",
          "item": canonicalUrl
        }
      ]
    }
  };

  return `
    <!-- Main Report Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(reportSchema, null, 2)}
    </script>
    
    <!-- Dataset Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(datasetSchema, null, 2)}
    </script>
    
    <!-- WebPage Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(webPageSchema, null, 2)}
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
      "description": "Comprehensive SEO performance rating based on technical, on-page, and semantic factors"
    }
  ];

  if (audit.result_json) {
    // Add component scores
    if (audit.result_json.technicalSEO) {
      variables.push({
        "@type": "PropertyValue",
        "name": "Technical SEO Score",
        "value": audit.result_json.technicalSEO.score,
        "unitText": "points out of 100",
        "description": "Technical website optimization including page speed, mobile-friendliness, and crawlability"
      });
    }

    if (audit.result_json.onPageSEO) {
      variables.push({
        "@type": "PropertyValue",
        "name": "On-Page SEO Score",
        "value": audit.result_json.onPageSEO.score,
        "unitText": "points out of 100",
        "description": "Content optimization including titles, meta descriptions, headers, and keyword usage"
      });
    }

    if (audit.result_json.semanticSEO) {
      variables.push({
        "@type": "PropertyValue",
        "name": "Semantic SEO Score",
        "value": audit.result_json.semanticSEO.score,
        "unitText": "points out of 100",
        "description": "Content semantic relevance and topical authority assessment"
      });
    }

    // Add Core Web Vitals if available
    if (audit.result_json.technicalAnalysis?.coreWebVitals) {
      const cwv = audit.result_json.technicalAnalysis.coreWebVitals;
      variables.push(
        {
          "@type": "PropertyValue",
          "name": "Largest Contentful Paint (LCP)",
          "value": cwv.lcp,
          "unitText": "seconds",
          "description": "Time to render the largest content element visible in the viewport"
        },
        {
          "@type": "PropertyValue",
          "name": "First Input Delay (FID)",
          "value": cwv.fid,
          "unitText": "milliseconds",
          "description": "Time from first user interaction to browser response"
        },
        {
          "@type": "PropertyValue",
          "name": "Cumulative Layout Shift (CLS)",
          "value": cwv.cls,
          "unitText": "score",
          "description": "Visual stability measurement of unexpected layout shifts"
        }
      );
    }

    // Add content analysis metrics
    if (audit.result_json.contentAnalysis) {
      const content = audit.result_json.contentAnalysis;
      variables.push(
        {
          "@type": "PropertyValue",
          "name": "Topic Relevance",
          "value": content.topicRelevance,
          "unitText": "percentage",
          "description": "Content relevance to target topics and keywords"
        },
        {
          "@type": "PropertyValue",
          "name": "Content Depth",
          "value": content.contentDepth,
          "unitText": "percentage",
          "description": "Comprehensiveness and depth of content coverage"
        },
        {
          "@type": "PropertyValue",
          "name": "Readability Score",
          "value": content.readabilityScore,
          "unitText": "percentage",
          "description": "Content readability and user accessibility score"
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
    'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'screaming frog', 'sitebulb'
  ];
  
  const ua = userAgent.toLowerCase();
  return crawlerPatterns.some(pattern => ua.includes(pattern));
}

export default async (request: Request, context: Context) => {
  const startTime = performance.now();
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
  
  // Enhanced audit ID validation
  if (!auditId || auditId.length < 5 || auditId.includes('/') || auditId.includes('..')) {
    console.warn(`Invalid audit ID format: ${auditId}`);
    return context.next();
  }

  try {
    console.log(`Processing SEO for audit ${auditId} from ${userAgent}`);
    
    const audit = await fetchAuditReport(auditId);
    
    if (!audit) {
      console.log(`Audit ${auditId} not found, serving 404 with SEO`);
      
      // Enhanced 404 page for missing audits
      const response = await context.next();
      const html = await response.text();
      
      const notFoundSEO = `
        <title>SEO Audit Report Not Found - Semantic SEO Auditor</title>
        <meta name="description" content="The requested SEO audit report could not be found. Run a new audit to get comprehensive SEO insights for your website.">
        <meta name="robots" content="noindex, follow">
        <link rel="canonical" href="https://benrgy.github.io/SemanticSeoAuditor/">
        
        <!-- Open Graph for 404 -->
        <meta property="og:title" content="SEO Audit Report Not Found">
        <meta property="og:description" content="The requested audit report is not available. Create a new SEO audit for your website.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://benrgy.github.io/SemanticSeoAuditor/">
        
        <!-- Twitter for 404 -->
        <meta name="twitter:title" content="SEO Audit Report Not Found">
        <meta name="twitter:description" content="The requested audit report is not available. Create a new SEO audit.">
        <meta name="twitter:card" content="summary">
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
          'x-seo-enhanced': 'true',
          'x-audit-status': 'not-found'
        },
      });
    }

    const response = await context.next();
    const html = await response.text();
    const seoTags = generateAdvancedSEOTags(audit);
    
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

    const processingTime = performance.now() - startTime;
    console.log(`SEO processing completed in ${processingTime.toFixed(2)}ms for audit ${auditId}`);

    return new Response(modifiedHtml, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=3600', // 5 min browser, 1 hour CDN
        'x-seo-enhanced': 'true',
        'x-processing-time': `${processingTime.toFixed(2)}ms`,
        'x-cache-status': auditCache.has(auditId) ? 'hit' : 'miss'
      },
    });

  } catch (error) {
    const processingTime = performance.now() - startTime;
    console.error(`Edge function error for audit ${auditId} (${processingTime.toFixed(2)}ms):`, error);
    
    // Fallback to normal response on error
    const response = await context.next();
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'x-seo-error': 'true',
        'x-processing-time': `${processingTime.toFixed(2)}ms`
      }
    });
  }
};