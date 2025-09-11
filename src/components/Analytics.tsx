import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Analytics tracking component
export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = async (eventType: string, metadata?: any) => {
    // Disable analytics entirely to prevent fetch errors
    return;
    
    try {
      // Skip analytics if Supabase is not properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Analytics disabled: Supabase not configured');
        return;
      }

      await supabase.from('usage_analytics').insert({
        user_id: user?.id,
        event_type: eventType,
        metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silently fail analytics to not disrupt user experience
      console.warn('Analytics tracking failed (non-critical):', error);
    }
  };

  const trackPageView = async (page: string) => {
    // Disable analytics entirely to prevent fetch errors
    return;
    
    try {
      await trackEvent('page_view', { page });
    } catch (error) {
      // Silently fail - analytics should never break the app
      console.warn('Page view tracking failed (non-critical):', error);
    }
  };

  const trackUserAction = async (action: string, details?: any) => {
    // Disable analytics entirely to prevent fetch errors
    return;
    
    try {
      await trackEvent('user_action', { action, ...details });
    } catch (error) {
      // Silently fail - analytics should never break the app
      console.warn('User action tracking failed (non-critical):', error);
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackUserAction
  };
};

// Page view tracker component
export const PageViewTracker: React.FC<{ page: string }> = ({ page }) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Use setTimeout to avoid blocking the main thread
    setTimeout(() => {
      trackPageView(page);
    }, 100);
  }, [page, trackPageView]);

  return null;
};

export default PageViewTracker;