import { useEffect } from 'react';

// Component to help with crawler detection and SEO debugging
export const CrawlerDetector: React.FC = () => {
  useEffect(() => {
    // Log user agent for debugging
    if (typeof window !== 'undefined') {
      console.log('User Agent:', navigator.userAgent);
      
      // Add meta tag to help identify if this is client-side rendering
      const meta = document.createElement('meta');
      meta.name = 'client-side-rendered';
      meta.content = 'true';
      document.head.appendChild(meta);
    }
  }, []);

  return null;
};

// Hook to detect if running in crawler context
export const useIsCrawler = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR context
  
  const userAgent = navigator.userAgent.toLowerCase();
  const crawlerPatterns = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot'
  ];
  
  return crawlerPatterns.some(pattern => userAgent.includes(pattern));
};