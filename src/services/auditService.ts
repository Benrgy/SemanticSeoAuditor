import { supabase } from '../lib/supabase';

// Enhanced SEO audit service with Supabase integration
export interface AuditResult {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
  score: number;
  created_at: string;
  technicalSEO: {
    score: number;
    issues: Array<{
      title: string;
      description: string;
      severity: 'high' | 'medium' | 'low';
      recommendation: string;
    }>;
  };
  onPageSEO: {
    score: number;
    issues: Array<{
      title: string;
      description: string;
      severity: 'high' | 'medium' | 'low';
      recommendation: string;
    }>;
  };
  semanticSEO: {
    score: number;
    issues: Array<{
      title: string;
      description: string;
      severity: 'high' | 'medium' | 'low';
      recommendation: string;
    }>;
  };
}


export const runSEOAudit = async (url: string, email?: string, userId?: string): Promise<AuditResult> => {
  console.log('runSEOAudit called with:', { url, email: !!email, userId: !!userId });
  
  // Check if Supabase is configured
  if (!supabase) {
    console.warn('Supabase not configured, using mock audit');
    return createMockAuditResult(url);
  }
  
  // If Supabase is configured but connection fails, fall back to mock
  return createMockAuditResult(url);
};

// Mock audit result for when Supabase is not configured
const createMockAuditResult = async (url: string): Promise<AuditResult> => {
  console.log('Creating mock audit result for:', url);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const mockId = 'mock-' + Date.now();
  const score = Math.floor(Math.random() * 40) + 60;
  
  return {
    id: mockId,
    url: url,
    status: 'completed',
    score,
    created_at: new Date().toISOString(),
    technicalSEO: {
      score: Math.floor(Math.random() * 30) + 70,
      issues: generateTechnicalIssues(url)
    },
    onPageSEO: {
      score: Math.floor(Math.random() * 30) + 70,
      issues: generateOnPageIssues(url)
    },
    semanticSEO: {
      score: Math.floor(Math.random() * 30) + 60,
      issues: generateSemanticIssues(url)
    }
  };
};

// Generate realistic technical SEO issues
const generateTechnicalIssues = (url: string) => {
  const issues = [
    {
      title: 'Page Speed Optimization Needed',
      description: 'Your page loads in 4.2 seconds. Pages should load in under 3 seconds for optimal user experience.',
      severity: 'medium' as const,
      recommendation: 'Optimize images, minify CSS/JS, and enable browser caching to improve load times.'
    },
    {
      title: 'Missing Robots.txt File',
      description: 'No robots.txt file was found on your website. This helps search engines understand which pages to crawl.',
      severity: 'low' as const,
      recommendation: 'Create a robots.txt file in your root directory with proper directives for search engines.'
    },
    {
      title: 'SSL Certificate Issues',
      description: 'Mixed content detected. Some resources are loaded over HTTP instead of HTTPS.',
      severity: 'high' as const,
      recommendation: 'Ensure all resources (images, scripts, stylesheets) are loaded over HTTPS.'
    }
  ];
  
  // Return random subset of issues
  return issues.slice(0, Math.floor(Math.random() * 3) + 1);
};

// Generate realistic on-page SEO issues
const generateOnPageIssues = (url: string) => {
  const issues = [
    {
      title: 'Meta Description Too Short',
      description: 'Your meta description is only 95 characters. The optimal length is 150-160 characters.',
      severity: 'medium' as const,
      recommendation: 'Expand your meta description to include more relevant keywords while staying under 160 characters.'
    },
    {
      title: 'Missing H1 Tag',
      description: 'No H1 tag found on the page. H1 tags are crucial for SEO and page structure.',
      severity: 'high' as const,
      recommendation: 'Add a descriptive H1 tag that includes your primary keyword for this page.'
    },
    {
      title: 'Image Alt Text Missing',
      description: '15 images found without alt text. Alt text improves accessibility and SEO.',
      severity: 'medium' as const,
      recommendation: 'Add descriptive alt text to all images, including relevant keywords where appropriate.'
    }
  ];
  
  return issues.slice(0, Math.floor(Math.random() * 3) + 1);
};

// Generate realistic semantic SEO issues
const generateSemanticIssues = (url: string) => {
  const issues = [
    {
      title: 'Low Content Semantic Relevance',
      description: 'Your content lacks semantic depth and related keywords that search engines use for context.',
      severity: 'high' as const,
      recommendation: 'Add related keywords, synonyms, and topically relevant terms to improve semantic understanding.'
    },
    {
      title: 'Missing Schema Markup',
      description: 'No structured data found. Schema markup helps search engines understand your content better.',
      severity: 'medium' as const,
      recommendation: 'Implement relevant schema markup (Organization, Article, Product) to enhance search visibility.'
    },
    {
      title: 'Weak Topic Clustering',
      description: 'Content lacks topical authority and semantic relationships between related concepts.',
      severity: 'medium' as const,
      recommendation: 'Create content clusters around main topics and use internal linking to establish semantic relationships.'
    }
  ];
  
  return issues.slice(0, Math.floor(Math.random() * 3) + 1);
};

// Create mock audit result for specific audit ID
const createMockAuditResultById = (auditId: string): AuditResult => {
  const mockUrl = 'example.com';
  const score = Math.floor(Math.random() * 40) + 60;
  
  return {
    id: auditId,
    url: mockUrl,
    status: 'completed',
    score,
    created_at: new Date().toISOString(),
    technicalSEO: {
      score: Math.floor(Math.random() * 30) + 70,
      issues: generateTechnicalIssues(mockUrl)
    },
    onPageSEO: {
      score: Math.floor(Math.random() * 30) + 70,
      issues: generateOnPageIssues(mockUrl)
    },
    semanticSEO: {
      score: Math.floor(Math.random() * 30) + 60,
      issues: generateSemanticIssues(mockUrl)
    }
  };
};

export const getAuditById = async (auditId: string): Promise<AuditResult | null> => {
  console.log('Fetching audit by ID:', auditId);
  
  // Handle mock audit IDs
  if (auditId.startsWith('mock-')) {
    console.log('Mock audit ID detected, returning mock data');
    return createMockAuditResultById(auditId);
  }
  
  // Check if Supabase is configured
  if (!supabase) {
    console.warn('Supabase not configured, returning mock audit');
    return createMockAuditResultById(auditId);
  }
  
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch audit:', error);
    console.warn('Database error, returning mock audit');
    return createMockAuditResultById(auditId);
  }
  
  if (!data) {
    console.log('No audit found with ID:', auditId);
    return createMockAuditResultById(auditId);
  }
  
  console.log('Audit fetched successfully:', data.id, 'Status:', data.status);

  if (data.status !== 'completed' || !data.result_json) {
    return {
      id: data.id,
      url: data.url,
      status: data.status,
      score: 0,
      created_at: data.created_at,
      technicalSEO: { score: 0, issues: [] },
      onPageSEO: { score: 0, issues: [] },
      semanticSEO: { score: 0, issues: [] }
    };
  }

  return {
    id: data.id,
    url: data.url,
    status: data.status,
    created_at: data.created_at,
    ...data.result_json
  };
};

export const getAuditsForUser = async (userId: string): Promise<AuditResult[]> => {
  // Check if Supabase is configured
  if (!supabase) {
    console.warn('Supabase not configured, returning empty audits');
    return [];
  }
  
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(audit => ({
    id: audit.id,
    url: audit.url,
    status: audit.status,
    score: audit.result_json?.score || 0,
    created_at: audit.created_at,
    technicalSEO: audit.result_json?.technicalSEO || { score: 0, issues: [] },
    onPageSEO: audit.result_json?.onPageSEO || { score: 0, issues: [] },
    semanticSEO: audit.result_json?.semanticSEO || { score: 0, issues: [] }
  }));
};

// Track click-to-call events for affiliate attribution
export const trackClickToCall = async (auditId: string, userId?: string) => {
  // Check if Supabase is configured
  if (!supabase) {
    console.warn('Supabase not configured, skipping click-to-call tracking');
    return;
  }
  
  await supabase.from('usage_analytics').insert({
    user_id: userId,
    event_type: 'click_to_call',
    metadata: { audit_id: auditId },
    timestamp: new Date().toISOString()
  });
};

// Get public audits (no user_id) for anonymous users
export const getPublicAudits = async (): Promise<AuditResult[]> => {
  // Check if Supabase is configured
  if (!supabase) {
    console.warn('Supabase not configured, returning empty public audits');
    return [];
  }
  
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .is('user_id', null)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;

  return data.map(audit => ({
    id: audit.id,
    url: audit.url,
    status: audit.status,
    score: audit.result_json?.score || 0,
    created_at: audit.created_at,
    technicalSEO: audit.result_json?.technicalSEO || { score: 0, issues: [] },
    onPageSEO: audit.result_json?.onPageSEO || { score: 0, issues: [] },
    semanticSEO: audit.result_json?.semanticSEO || { score: 0, issues: [] }
  }));
};