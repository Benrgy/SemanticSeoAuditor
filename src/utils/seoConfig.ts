export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const seoConfigs: Record<string, SEOConfig> = {
  '/': {
    title: 'Semantic SEO Auditor - Free Website SEO Analysis Tool',
    description: 'Get instant, comprehensive SEO audits for your website. Analyze technical, on-page, and semantic SEO with AI-powered insights. No signup required - results in under 3 seconds.',
    keywords: 'SEO audit, website analysis, technical SEO, on-page SEO, semantic SEO, free SEO tool, website optimization',
    ogTitle: 'Semantic SEO Auditor - Free Instant Website Analysis',
    ogDescription: 'Professional SEO audits in 3 seconds. Technical, on-page & semantic analysis with actionable recommendations. Try it free!',
    twitterTitle: 'Semantic SEO Auditor - Free SEO Analysis',
    twitterDescription: 'Get instant SEO insights for your website. Professional analysis in under 3 seconds, completely free!'
  },
  '/login': {
    title: 'Login - Semantic SEO Auditor',
    description: 'Sign in to your Semantic SEO Auditor account to access your audit history, saved reports, and advanced SEO analysis features.',
    keywords: 'SEO login, account access, SEO dashboard, audit history',
    ogTitle: 'Login to Semantic SEO Auditor',
    ogDescription: 'Access your SEO audit dashboard and saved reports',
    twitterTitle: 'Login - Semantic SEO Auditor',
    twitterDescription: 'Sign in to access your SEO audit history and advanced features'
  },
  '/signup': {
    title: 'Sign Up - Semantic SEO Auditor',
    description: 'Create your free Semantic SEO Auditor account to save audit history, track improvements, and access advanced SEO analysis features.',
    keywords: 'SEO signup, create account, free SEO tool, SEO dashboard',
    ogTitle: 'Create Free Account - Semantic SEO Auditor',
    ogDescription: 'Sign up for free to save your SEO audits and track website improvements over time',
    twitterTitle: 'Sign Up Free - Semantic SEO Auditor',
    twitterDescription: 'Create your free account to save SEO audits and track improvements'
  },
  '/dashboard': {
    title: 'SEO Dashboard - Semantic SEO Auditor',
    description: 'View your SEO audit history, track website improvements, and manage your SEO analysis reports in your personal dashboard.',
    keywords: 'SEO dashboard, audit history, website tracking, SEO reports, SEO management',
    ogTitle: 'SEO Audit Dashboard - Track Your Website Performance',
    ogDescription: 'Manage your SEO audits, track improvements, and view detailed analysis reports',
    twitterTitle: 'SEO Dashboard - Semantic SEO Auditor',
    twitterDescription: 'Track your website SEO performance and view audit history'
  },
  '/files': {
    title: 'File Management - Semantic SEO Auditor',
    description: 'Upload and manage SEO-related files like sitemaps, robots.txt, and configuration files for enhanced website analysis.',
    keywords: 'SEO files, sitemap upload, robots.txt, file management, SEO configuration',
    ogTitle: 'SEO File Management - Upload Sitemaps & Configuration Files',
    ogDescription: 'Manage your SEO files including sitemaps, robots.txt, and configuration files',
    twitterTitle: 'SEO File Management - Semantic SEO Auditor',
    twitterDescription: 'Upload and manage your SEO files for enhanced website analysis'
  }
};

export const getDefaultSEO = (): SEOConfig => seoConfigs['/'];

export const getSEOForPath = (pathname: string): SEOConfig => {
  // Handle dynamic routes like /audit/:id
  if (pathname.startsWith('/audit/')) {
    return {
      title: 'SEO Audit Report - Semantic SEO Auditor',
      description: 'View your comprehensive SEO audit report with technical, on-page, and semantic analysis. Get actionable recommendations to improve your website rankings.',
      keywords: 'SEO report, audit results, website analysis, SEO recommendations, technical SEO',
      ogTitle: 'SEO Audit Report - Detailed Website Analysis',
      ogDescription: 'Comprehensive SEO audit report with actionable recommendations for website improvement',
      twitterTitle: 'SEO Audit Report - Semantic SEO Auditor',
      twitterDescription: 'View detailed SEO analysis and recommendations for your website'
    };
  }
  
  return seoConfigs[pathname] || getDefaultSEO();
};