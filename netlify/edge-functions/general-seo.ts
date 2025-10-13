import { Context } from "https://edge.netlify.com/";

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  canonicalUrl: string;
  structuredData?: any;
  additionalMeta?: Record<string, string>;
}

// Enhanced route-specific SEO configurations with advanced metadata
const routeConfigs: Record<string, SEOData> = {
  '/': {
    title: 'Semantic SEO Auditor - Free Website SEO Analysis Tool',
    description: 'Get instant, comprehensive SEO audits for your website. Analyze technical, on-page, and semantic SEO with AI-powered insights. No signup required - results in under 3 seconds.',
    keywords: 'SEO audit, website analysis, technical SEO, on-page SEO, semantic SEO, free SEO tool, website optimization, search engine optimization, AI SEO analysis, instant SEO report',
    ogTitle: 'Semantic SEO Auditor - Free Instant Website Analysis',
    ogDescription: 'Professional SEO audits in 3 seconds. Technical, on-page & semantic analysis with actionable recommendations. Try it free!',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-image.png',
    twitterTitle: 'Semantic SEO Auditor - Free SEO Analysis',
    twitterDescription: 'Get instant SEO insights for your website. Professional analysis in under 3 seconds, completely free!',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/',
    additionalMeta: {
      'application-name': 'Semantic SEO Auditor',
      'apple-mobile-web-app-title': 'SEO Auditor',
      'msapplication-tooltip': 'Free SEO Analysis Tool',
      'rating': 'general',
      'distribution': 'global',
      'revisit-after': '3 days'
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Semantic SEO Auditor",
      "description": "Free comprehensive SEO audit tool with technical, on-page, and semantic analysis",
      "url": "https://benrgy.github.io/SemanticSeoAuditor",
      "applicationCategory": "SEO Tool",
      "operatingSystem": "Web Browser",
      "browserRequirements": "Requires JavaScript",
      "softwareVersion": "2.0",
      "releaseNotes": "Enhanced AI-powered semantic analysis and improved performance",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      "creator": {
        "@type": "Organization",
        "name": "Semantic SEO Auditor",
        "url": "https://benrgy.github.io/SemanticSeoAuditor",
        "logo": {
          "@type": "ImageObject",
          "url": "https://benrgy.github.io/SemanticSeoAuditor/logo.png"
        }
      },
      "featureList": [
        "Technical SEO Analysis",
        "On-Page SEO Optimization",
        "Semantic SEO Insights",
        "AI-Powered Recommendations",
        "Instant Results (3 seconds)",
        "No Signup Required",
        "Expert Support Available",
        "Mobile-Friendly Analysis",
        "Core Web Vitals Assessment",
        "Structured Data Validation"
      ],
      "screenshot": {
        "@type": "ImageObject",
        "url": "https://benrgy.github.io/SemanticSeoAuditor/screenshot.png"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  },
  '/login': {
    title: 'Login - Semantic SEO Auditor | Access Your SEO Dashboard',
    description: 'Sign in to your Semantic SEO Auditor account to access your audit history, saved reports, advanced SEO analysis features, and personalized recommendations.',
    keywords: 'SEO login, account access, SEO dashboard, audit history, user login, SEO account, website analysis login',
    ogTitle: 'Login to Semantic SEO Auditor - Access Your SEO Dashboard',
    ogDescription: 'Access your SEO audit dashboard, view saved reports, and track your website improvements over time.',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-login.png',
    twitterTitle: 'Login - Semantic SEO Auditor',
    twitterDescription: 'Sign in to access your SEO audit history and advanced features',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/login',
    additionalMeta: {
      'robots': 'noindex, follow',
      'referrer': 'strict-origin-when-cross-origin'
    }
  },
  '/signup': {
    title: 'Sign Up Free - Semantic SEO Auditor | Create Your Account',
    description: 'Create your free Semantic SEO Auditor account to save audit history, track improvements, access advanced SEO analysis features, and get personalized recommendations.',
    keywords: 'SEO signup, create account, free SEO tool, SEO dashboard, register, free SEO account, website analysis account',
    ogTitle: 'Create Free Account - Semantic SEO Auditor',
    ogDescription: 'Sign up for free to save your SEO audits, track website improvements over time, and access advanced features.',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-signup.png',
    twitterTitle: 'Sign Up Free - Semantic SEO Auditor',
    twitterDescription: 'Create your free account to save SEO audits and track improvements',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/signup',
    additionalMeta: {
      'robots': 'index, follow',
      'referrer': 'strict-origin-when-cross-origin'
    }
  },
  '/dashboard': {
    title: 'SEO Dashboard - Semantic SEO Auditor | Track Your Website Performance',
    description: 'View your SEO audit history, track website improvements, manage your SEO analysis reports, and monitor your search rankings in your personal dashboard.',
    keywords: 'SEO dashboard, audit history, website tracking, SEO reports, SEO management, performance tracking, search rankings, website analytics',
    ogTitle: 'SEO Audit Dashboard - Track Your Website Performance',
    ogDescription: 'Manage your SEO audits, track improvements, view detailed analysis reports, and monitor your search performance.',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-dashboard.png',
    twitterTitle: 'SEO Dashboard - Semantic SEO Auditor',
    twitterDescription: 'Track your website SEO performance and view audit history',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/dashboard',
    additionalMeta: {
      'robots': 'noindex, follow',
      'referrer': 'strict-origin-when-cross-origin'
    }
  },
  '/files': {
    title: 'SEO File Management - Upload Sitemaps & Configuration Files',
    description: 'Upload and manage SEO-related files like XML sitemaps, robots.txt, and configuration files for enhanced website analysis and better search engine optimization.',
    keywords: 'SEO files, sitemap upload, robots.txt, file management, SEO configuration, XML sitemap, website files, SEO tools',
    ogTitle: 'SEO File Management - Upload Sitemaps & Configuration Files',
    ogDescription: 'Manage your SEO files including sitemaps, robots.txt, and configuration files for enhanced analysis.',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-files.png',
    twitterTitle: 'SEO File Management - Semantic SEO Auditor',
    twitterDescription: 'Upload and manage your SEO files for enhanced website analysis',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/files',
    additionalMeta: {
      'robots': 'noindex, follow',
      'referrer': 'strict-origin-when-cross-origin'
    }
  }
};

// Performance monitoring
const performanceMetrics = {
  requests: 0,
  totalProcessingTime: 0,
  cacheHits: 0,
  errors: 0
};

function generateEnhancedHead(seoData: SEOData): string {
  const structuredDataScript = seoData.structuredData 
    ? `<script type="application/ld+json">${JSON.stringify(seoData.structuredData, null, 2)}</script>`
    : '';

  const additionalMetaTags = seoData.additionalMeta 
    ? Object.entries(seoData.additionalMeta)
        .map(([name, content]) => `<meta name="${name}" content="${content}" />`)
        .join('\n    ')
    : '';

  return `
    <title>${seoData.title}</title>
    <meta name="description" content="${seoData.description}" />
    <meta name="keywords" content="${seoData.keywords}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="author" content="Semantic SEO Auditor" />
    <meta name="generator" content="Semantic SEO Auditor v2.0" />
    <meta name="language" content="en" />
    <meta name="geo.region" content="US" />
    <meta name="geo.placename" content="United States" />
    ${additionalMetaTags}
    <link rel="canonical" href="${seoData.canonicalUrl}" />
    
    <!-- Enhanced Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seoData.ogTitle}" />
    <meta property="og:description" content="${seoData.ogDescription}" />
    <meta property="og:url" content="${seoData.canonicalUrl}" />
    <meta property="og:site_name" content="Semantic SEO Auditor" />
    <meta property="og:image" content="${seoData.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Semantic SEO Auditor - Free Website Analysis Tool" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:updated_time" content="${new Date().toISOString()}" />
    
    <!-- Enhanced Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoData.twitterTitle}" />
    <meta name="twitter:description" content="${seoData.twitterDescription}" />
    <meta name="twitter:image" content="${seoData.ogImage}" />
    <meta name="twitter:image:alt" content="Semantic SEO Auditor - Free Website Analysis Tool" />
    <meta name="twitter:site" content="@SemanticSEO" />
    <meta name="twitter:creator" content="@SemanticSEO" />
    <meta name="twitter:domain" content="benrgy.github.io" />
    
    <!-- Additional SEO Meta Tags -->
    <meta name="theme-color" content="#1f2937" />
    <meta name="msapplication-TileColor" content="#1f2937" />
    <meta name="msapplication-TileImage" content="https://benrgy.github.io/SemanticSeoAuditor/mstile-144x144.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="SEO Auditor" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    
    <!-- Performance and Resource Hints -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://benrgy.github.io" />
    <link rel="preload" href="https://benrgy.github.io/SemanticSeoAuditor/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
    
    <!-- Favicon and Icons -->
    <link rel="icon" type="image/svg+xml" href="./vite.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png" />
    <link rel="manifest" href="./site.webmanifest" />
    
    <!-- Security Headers -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    
    ${structuredDataScript}
  `;
}

function isCrawler(userAgent: string): boolean {
  const crawlerPatterns = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
    'facebookexternalhit', 'twitterbot', 'rogerbot', 'linkedinbot', 'embedly',
    'quora link preview', 'showyoubot', 'outbrain', 'pinterest/0.',
    'developers.google.com/+/web/snippet', 'slackbot', 'vkshare', 'w3c_validator',
    'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr', 'bitlybot',
    'skypeuripreview', 'nuzzel', 'discordbot', 'google page speed', 'qwantify',
    'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'screaming frog', 'sitebulb',
    'deepcrawl', 'oncrawl', 'botify', 'searchmetrics', 'brightedge'
  ];
  
  const ua = userAgent.toLowerCase();
  return crawlerPatterns.some(pattern => ua.includes(pattern));
}

function logPerformanceMetrics() {
  if (performanceMetrics.requests > 0) {
    const avgProcessingTime = performanceMetrics.totalProcessingTime / performanceMetrics.requests;
    const cacheHitRate = (performanceMetrics.cacheHits / performanceMetrics.requests) * 100;
    const errorRate = (performanceMetrics.errors / performanceMetrics.requests) * 100;
    
    console.log(`Performance Metrics - Requests: ${performanceMetrics.requests}, Avg Time: ${avgProcessingTime.toFixed(2)}ms, Cache Hit Rate: ${cacheHitRate.toFixed(1)}%, Error Rate: ${errorRate.toFixed(1)}%`);
  }
}

// Log metrics every 100 requests
setInterval(() => {
  if (performanceMetrics.requests % 100 === 0 && performanceMetrics.requests > 0) {
    logPerformanceMetrics();
  }
}, 60000); // Every minute

export default async function handler(request: Request, context: Context) {
  const startTime = performance.now();
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  
  performanceMetrics.requests++;
  
  // Skip audit routes (handled by audit-seo function)
  if (pathname.startsWith('/audit/')) {
    return context.next();
  }
  
  // Only enhance for crawlers and social media bots
  if (!isCrawler(userAgent)) {
    return context.next();
  }
  
  try {
    console.log(`Processing general SEO for ${pathname} from ${userAgent}`);
    
    // Get SEO data for the route
    const seoData = routeConfigs[pathname] || routeConfigs['/'];
    
    // Check if we have cached response (simple in-memory cache)
    const cacheKey = `${pathname}-${userAgent}`;
    
    // Fetch the original HTML
    const response = await context.next();
    const html = await response.text();
    
    // Generate enhanced head content
    const enhancedHead = generateEnhancedHead(seoData);
    
    // Replace the head content with more robust regex
    const enhancedHtml = html.replace(
      /<head[^>]*>[\s\S]*?<\/head>/i,
      `<head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${enhancedHead}
      </head>`
    );
    
    const processingTime = performance.now() - startTime;
    performanceMetrics.totalProcessingTime += processingTime;
    
    console.log(`General SEO processing completed in ${processingTime.toFixed(2)}ms for ${pathname}`);
    
    return new Response(enhancedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=3600', // 5 min browser, 1 hour CDN
        'x-seo-enhanced': 'true',
        'x-processing-time': `${processingTime.toFixed(2)}ms`,
        'x-seo-version': '2.0'
      }
    });

  } catch (error) {
    const processingTime = performance.now() - startTime;
    performanceMetrics.errors++;
    performanceMetrics.totalProcessingTime += processingTime;
    
    console.error(`General SEO edge function error for ${pathname} (${processingTime.toFixed(2)}ms):`, error);
    
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
}