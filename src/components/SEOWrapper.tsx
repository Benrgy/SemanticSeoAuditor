import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getSEOForPath } from "../utils/seoConfig";
import { useEffect } from "react";

export const SEOWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const seoConfig = getSEOForPath(location.pathname);

  // Update document title immediately for better UX
  useEffect(() => {
    document.title = seoConfig.title;
  }, [seoConfig.title]);

  // Add performance monitoring
  useEffect(() => {
    // Track page view timing
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Log performance metrics (can be sent to analytics)
      if (loadTime > 100) {
        console.warn(`Slow page load: ${location.pathname} took ${loadTime.toFixed(2)}ms`);
      }
    };
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Semantic SEO Auditor" />
        <meta name="generator" content="Semantic SEO Auditor" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href={`https://benrgy.github.io/SemanticSeoAuditor${location.pathname}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoConfig.ogTitle} />
        <meta property="og:description" content={seoConfig.ogDescription} />
        <meta property="og:url" content={`https://benrgy.github.io/SemanticSeoAuditor${location.pathname}`} />
        <meta property="og:site_name" content="Semantic SEO Auditor" />
        <meta property="og:image" content="https://benrgy.github.io/SemanticSeoAuditor/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Semantic SEO Auditor - Free Website Analysis Tool" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoConfig.twitterTitle} />
        <meta name="twitter:description" content={seoConfig.twitterDescription} />
        <meta name="twitter:image" content="https://benrgy.github.io/SemanticSeoAuditor/og-image.png" />
        <meta name="twitter:image:alt" content="Semantic SEO Auditor - Free Website Analysis Tool" />
        <meta name="twitter:site" content="@SemanticSEO" />
        <meta name="twitter:creator" content="@SemanticSEO" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://benrgy.github.io" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Semantic SEO Auditor",
            "description": "Free comprehensive SEO audit tool with technical, on-page, and semantic analysis",
            "url": "https://benrgy.github.io/SemanticSeoAuditor",
            "applicationCategory": "SEO Tool",
            "operatingSystem": "Web Browser",
            "browserRequirements": "Requires JavaScript",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "creator": {
              "@type": "Organization",
              "name": "Semantic SEO Auditor",
              "url": "https://benrgy.github.io/SemanticSeoAuditor"
            },
            "featureList": [
              "Technical SEO Analysis",
              "On-Page SEO Optimization", 
              "Semantic SEO Insights",
              "AI-Powered Recommendations",
              "Instant Results",
              "No Signup Required"
            ]
          }, null, 2)}
        </script>
      </Helmet>
      {children}
    </>
  );
};