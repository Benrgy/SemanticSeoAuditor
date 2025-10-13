import { useEffect } from 'react';

// Component to help with crawler detection and SEO debugging
export const CrawlerDetector: React.FC = () => {
  useEffect(() => {
    // Log user agent for debugging
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      console.log('User Agent:', userAgent);
      
      // Detect if this is a crawler
      const isCrawler = detectCrawler(userAgent);
      if (isCrawler) {
        console.log('🤖 Crawler detected:', userAgent);
      }
      
      // Add meta tag to help identify if this is client-side rendering
      const meta = document.createElement('meta');
      meta.name = 'client-side-rendered';
      meta.content = 'true';
      document.head.appendChild(meta);
      
      // Add performance monitoring
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          console.log('Page Load Performance:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A',
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A'
          });
        }
      }
    }
  }, []);

  return null;
};

// Enhanced crawler detection function
function detectCrawler(userAgent: string): boolean {
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

// Hook to detect if running in crawler context
export const useIsCrawler = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR context
  
  const userAgent = navigator.userAgent.toLowerCase();
  return detectCrawler(userAgent);
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
          console.log('CLS:', entry.value);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Some browsers might not support all entry types
      console.warn('Performance observer not fully supported:', e);
    }

    return () => observer.disconnect();
  }, []);
};