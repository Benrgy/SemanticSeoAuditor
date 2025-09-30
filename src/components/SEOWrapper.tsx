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

  return (
    <>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <meta name="robots" content="index, follow" />
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
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoConfig.twitterTitle} />
        <meta name="twitter:description" content={seoConfig.twitterDescription} />
        <meta name="twitter:image" content="https://benrgy.github.io/SemanticSeoAuditor/og-image.png" />
        <meta name="twitter:site" content="@SemanticSEO" />
        <meta name="twitter:creator" content="@SemanticSEO" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="author" content="Semantic SEO Auditor" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="theme-color" content="#1f2937" />
        
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
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "Semantic SEO Auditor"
            }
          })}
        </script>
      </Helmet>
      {children}
    </>
  );
};