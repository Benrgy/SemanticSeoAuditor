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
}

// Route-specific SEO configurations
const routeConfigs: Record<string, SEOData> = {
  '/': {
    title: 'Semantic SEO Auditor - Free Website SEO Analysis Tool',
    description: 'Get instant, comprehensive SEO audits for your website. Analyze technical, on-page, and semantic SEO with AI-powered insights. No signup required - results in under 3 seconds.',
    keywords: 'SEO audit, website analysis, technical SEO, on-page SEO, semantic SEO, free SEO tool, website optimization',
    ogTitle: 'Semantic SEO Auditor - Free Instant Website Analysis',
    ogDescription: 'Professional SEO audits in 3 seconds. Technical, on-page & semantic analysis with actionable recommendations. Try it free!',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-image.png',
    twitterTitle: 'Semantic SEO Auditor - Free SEO Analysis',
    twitterDescription: 'Get instant SEO insights for your website. Professional analysis in under 3 seconds, completely free!',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Semantic SEO Auditor",
      "description": "Free comprehensive SEO audit tool with technical, on-page, and semantic analysis",
      "url": "https://benrgy.github.io/SemanticSeoAuditor",
      "applicationCategory": "SEO Tool",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "Semantic SEO Auditor"
      }
    }
  },
  '/login': {
    title: 'Login - Semantic SEO Auditor',
    description: 'Sign in to your Semantic SEO Auditor account to access your audit history, saved reports, and advanced SEO analysis features.',
    keywords: 'SEO login, account access, SEO dashboard, audit history',
    ogTitle: 'Login to Semantic SEO Auditor',
    ogDescription: 'Access your SEO audit dashboard and saved reports',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-image.png',
    twitterTitle: 'Login - Semantic SEO Auditor',
    twitterDescription: 'Sign in to access your SEO audit history and advanced features',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/login'
  },
  '/signup': {
    title: 'Sign Up - Semantic SEO Auditor',
    description: 'Create your free Semantic SEO Auditor account to save audit history, track improvements, and access advanced SEO analysis features.',
    keywords: 'SEO signup, create account, free SEO tool, SEO dashboard',
    ogTitle: 'Create Free Account - Semantic SEO Auditor',
    ogDescription: 'Sign up for free to save your SEO audits and track website improvements over time',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-image.png',
    twitterTitle: 'Sign Up Free - Semantic SEO Auditor',
    twitterDescription: 'Create your free account to save SEO audits and track improvements',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/signup'
  },
  '/dashboard': {
    title: 'SEO Dashboard - Semantic SEO Auditor',
    description: 'View your SEO audit history, track website improvements, and manage your SEO analysis reports in your personal dashboard.',
    keywords: 'SEO dashboard, audit history, website tracking, SEO reports, SEO management',
    ogTitle: 'SEO Audit Dashboard - Track Your Website Performance',
    ogDescription: 'Manage your SEO audits, track improvements, and view detailed analysis reports',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-image.png',
    twitterTitle: 'SEO Dashboard - Semantic SEO Auditor',
    twitterDescription: 'Track your website SEO performance and view audit history',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/dashboard'
  },
  '/files': {
    title: 'File Management - Semantic SEO Auditor',
    description: 'Upload and manage SEO-related files like sitemaps, robots.txt, and configuration files for enhanced website analysis.',
    keywords: 'SEO files, sitemap upload, robots.txt, file management, SEO configuration',
    ogTitle: 'SEO File Management - Upload Sitemaps & Configuration Files',
    ogDescription: 'Manage your SEO files including sitemaps, robots.txt, and configuration files',
    ogImage: 'https://benrgy.github.io/SemanticSeoAuditor/og-image.png',
    twitterTitle: 'SEO File Management - Semantic SEO Auditor',
    twitterDescription: 'Upload and manage your SEO files for enhanced website analysis',
    canonicalUrl: 'https://benrgy.github.io/SemanticSeoAuditor/files'
  }
};

function generateEnhancedHead(seoData: SEOData): string {
  const structuredDataScript = seoData.structuredData 
    ? `<script type="application/ld+json">${JSON.stringify(seoData.structuredData)}</script>`
    : '';

  return `
    <title>${seoData.title}</title>
    <meta name="description" content="${seoData.description}" />
    <meta name="keywords" content="${seoData.keywords}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${seoData.canonicalUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seoData.ogTitle}" />
    <meta property="og:description" content="${seoData.ogDescription}" />
    <meta property="og:url" content="${seoData.canonicalUrl}" />
    <meta property="og:site_name" content="Semantic SEO Auditor" />
    <meta property="og:image" content="${seoData.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoData.twitterTitle}" />
    <meta name="twitter:description" content="${seoData.twitterDescription}" />
    <meta name="twitter:image" content="${seoData.ogImage}" />
    <meta name="twitter:site" content="@SemanticSEO" />
    
    <!-- Additional SEO -->
    <meta name="author" content="Semantic SEO Auditor" />
    <meta name="theme-color" content="#1f2937" />
    
    ${structuredDataScript}
  `;
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

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Skip audit routes (handled by audit-seo function)
  if (pathname.startsWith('/audit/')) {
    return context.next();
  }
  
  // Only enhance for crawlers and social media bots
  if (!isCrawler(userAgent)) {
    return context.next();
  }
  
  // Get SEO data for the route
  const seoData = routeConfigs[pathname] || routeConfigs['/'];
  
  // Fetch the original HTML
  const response = await context.next();
  const html = await response.text();
  
  // Generate enhanced head content
  const enhancedHead = generateEnhancedHead(seoData);
  
  // Replace the head content
  const enhancedHtml = html.replace(
    /<head[^>]*>[\s\S]*?<\/head>/i,
    `<head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="./vite.svg" />
      ${enhancedHead}
    </head>`
  );
  
  return new Response(enhancedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers),
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600'
    }
  });
}