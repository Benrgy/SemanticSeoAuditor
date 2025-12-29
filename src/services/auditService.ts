import { supabase } from '../lib/supabase';
import { analyzeGeographic, GeographicAnalysis } from './geographicAnalyzer';
import { analyzeVoiceSearch, VoiceSearchAnalysis } from './voiceSearchAnalyzer';
import { analyzeCompetitive, CompetitiveAnalysis } from './competitiveAnalyzer';

export interface AuditResult {
  id: string;
  score: number;
  issues: AuditIssue[];
  recommendations: string[];
  metadata?: {
    url: string;
    analyzedAt: string;
    responseTime: number;
    contentLength: number;
    statusCode: number;
  };
  geographic?: GeographicAnalysis;
  voiceSearch?: VoiceSearchAnalysis;
  competitive?: CompetitiveAnalysis;
}

export interface AuditIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  element?: string;
}

async function analyzeHTML(html: string, url: string): Promise<Omit<AuditResult, 'id'>> {
  const issues: AuditIssue[] = [];
  const recommendations: string[] = [];
  const startTime = Date.now();

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!titleMatch) {
    issues.push({
      type: 'missing-title',
      severity: 'high',
      description: 'Page is missing a title tag',
    });
    recommendations.push('Add a compelling, keyword-rich title tag');
  } else {
    const title = titleMatch[1].trim();
    if (title.length === 0) {
      issues.push({ type: 'empty-title', severity: 'high', description: 'Title tag is empty' });
    } else if (title.length < 30) {
      issues.push({ type: 'short-title', severity: 'medium', description: 'Title tag is too short (less than 30 characters)' });
    } else if (title.length > 60) {
      issues.push({ type: 'long-title', severity: 'low', description: 'Title tag is too long (more than 60 characters)' });
    }
  }

  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (!metaDescMatch) {
    issues.push({
      type: 'missing-meta-description',
      severity: 'high',
      description: 'Page is missing a meta description',
    });
    recommendations.push('Add a compelling meta description to improve click-through rates');
  } else {
    const desc = metaDescMatch[1].trim();
    if (desc.length < 120) {
      issues.push({ type: 'short-meta-description', severity: 'medium', description: 'Meta description is too short' });
    } else if (desc.length > 160) {
      issues.push({ type: 'long-meta-description', severity: 'low', description: 'Meta description is too long' });
    }
  }

  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    issues.push({ type: 'missing-h1', severity: 'high', description: 'Page is missing an H1 heading' });
    recommendations.push('Add a clear H1 heading that describes the page content');
  } else if (h1Matches.length > 1) {
    issues.push({ type: 'multiple-h1', severity: 'medium', description: `Found ${h1Matches.length} H1 tags (should only have one)` });
  }

  if (!/<meta\s+name=["']viewport["']/i.test(html)) {
    issues.push({ type: 'missing-viewport', severity: 'medium', description: 'Missing viewport meta tag for mobile responsiveness' });
    recommendations.push("Add viewport meta tag: <meta name='viewport' content='width=device-width, initial-scale=1'>");
  }

  if (!/<link\s+rel=["']canonical["']/i.test(html)) {
    issues.push({ type: 'missing-canonical', severity: 'low', description: 'Missing canonical URL' });
  }

  const ogTags = html.match(/<meta\s+property=["']og:/gi);
  if (!ogTags || ogTags.length < 3) {
    issues.push({ type: 'missing-og-tags', severity: 'low', description: 'Missing or incomplete Open Graph tags' });
  }

  const images = html.match(/<img[^>]*>/gi);
  if (images) {
    const imagesWithoutAlt = images.filter(img => !img.match(/alt=["'][^"']*["']/i));
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'missing-image-alt',
        severity: 'medium',
        description: `Found ${imagesWithoutAlt.length} images without alt attributes`,
      });
      recommendations.push('Add alt attributes to all images for accessibility and SEO');
    }
  }

  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  if (h2Count === 0) {
    issues.push({ type: 'no-h2-headings', severity: 'low', description: 'No H2 headings found' });
  }

  const internalLinks = html.match(/<a\s+[^>]*href=["'][^"']*(#|\/)[^"']*["']/gi) || [];
  if (internalLinks.length < 3) {
    issues.push({ type: 'few-internal-links', severity: 'low', description: 'Very few internal links found' });
  }

  const hasJsonLd = /<script\s+type=["']application\/ld\+json["']/i.test(html);
  const hasMicrodata = /itemscope|itemprop/i.test(html);
  if (!hasJsonLd && !hasMicrodata) {
    issues.push({ type: 'missing-structured-data', severity: 'low', description: 'No structured data (Schema.org) found' });
  }

  const robotsMeta = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  if (robotsMeta && (robotsMeta[1].includes('noindex') || robotsMeta[1].includes('nofollow'))) {
    issues.push({
      type: 'robots-restriction',
      severity: 'high',
      description: 'Page has robots restriction (noindex/nofollow)',
    });
  }

  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push({
      type: 'thin-content',
      severity: 'medium',
      description: `Low word count (${wordCount} words)`,
    });
    recommendations.push('Expand your content to provide more value to users');
  }

  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'high') score -= 15;
    else if (issue.severity === 'medium') score -= 10;
    else score -= 5;
  });
  score = Math.max(0, Math.min(100, score));

  if (recommendations.length === 0) {
    recommendations.push('Great job! Your page has good SEO fundamentals');
    recommendations.push('Continue monitoring and improving your content regularly');
  }

  return {
    score,
    issues,
    recommendations,
    metadata: {
      url,
      analyzedAt: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      contentLength: html.length,
      statusCode: 200,
    },
  };
}

export async function performAudit(url: string): Promise<Omit<AuditResult, 'id'>> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Please check your environment variables.');
  }

  const functionUrl = `${supabaseUrl}/functions/v1/run-seo-audit`;

  try {
    console.log(`🔍 Attempting to analyze: ${url}`);
    console.log(`📡 Using edge function: ${functionUrl}`);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Edge function error:', errorData);
      throw new Error(errorData.error || `Server returned ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Audit completed via edge function');

    const html = await fetch(url, { mode: 'cors' }).then(r => r.text()).catch(() => '');

    let geographic, voiceSearch, competitive;
    if (html) {
      geographic = analyzeGeographic(html, url);
      voiceSearch = analyzeVoiceSearch(html, url);
      competitive = analyzeCompetitive(html, url);
    }

    return {
      score: result.score,
      issues: result.issues,
      recommendations: result.recommendations,
      metadata: result.metadata,
      geographic,
      voiceSearch,
      competitive,
    };
  } catch (edgeFunctionError) {
    console.warn('⚠️  Edge function unavailable, trying direct fetch:', edgeFunctionError);

    try {
      const proxyResponse = await fetch(url, {
        mode: 'cors',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0)',
        },
      });

      if (!proxyResponse.ok) {
        throw new Error(`Website returned ${proxyResponse.status} status code`);
      }

      const html = await proxyResponse.text();
      console.log('✅ Audit completed via direct fetch (fallback)');
      const basicAnalysis = await analyzeHTML(html, url);

      return {
        ...basicAnalysis,
        geographic: analyzeGeographic(html, url),
        voiceSearch: analyzeVoiceSearch(html, url),
        competitive: analyzeCompetitive(html, url),
      };
    } catch (directFetchError) {
      console.error('❌ Direct fetch failed:', directFetchError);
      throw new Error(
        `Unable to analyze website "${url}". This could be due to:\n\n` +
        `1. The Supabase edge function 'run-seo-audit' is not deployed\n` +
        `2. The website blocks cross-origin requests (CORS)\n` +
        `3. The website is not accessible\n\n` +
        `Please deploy the edge function using: npx supabase functions deploy run-seo-audit`
      );
    }
  }
}

export async function runSEOAudit(
  url: string,
  email?: string,
  userId?: string
): Promise<AuditResult> {
  const auditData = await performAudit(url);

  const { data, error } = await supabase
    .from('audits')
    .insert({
      url,
      user_id: userId,
      status: 'completed',
      result_json: {
        score: auditData.score,
        issues: auditData.issues,
        recommendations: auditData.recommendations,
        metadata: auditData.metadata,
        email,
      },
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save audit: ${error.message}`);
  }

  return {
    id: data.id,
    score: data.result_json.score,
    issues: data.result_json.issues,
    recommendations: data.result_json.recommendations,
    metadata: data.result_json.metadata,
  };
}

export async function getAuditsForUser(userId: string) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch audits: ${error.message}`);
  }

  return data.map((audit) => ({
    id: audit.id,
    url: audit.url,
    created_at: audit.created_at,
    status: audit.status,
    user_id: audit.user_id,
    score: audit.result_json?.score || 0,
    issues: audit.result_json?.issues || [],
    recommendations: audit.result_json?.recommendations || [],
    metadata: audit.result_json?.metadata,
    email: audit.result_json?.email,
  }));
}

export async function getAuditById(auditId: string) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch audit: ${error.message}`);
  }

  if (!data) {
    throw new Error('Audit not found');
  }

  const issues = data.result_json?.issues || [];

  const technicalIssues = issues.filter((issue: AuditIssue) =>
    ['missing-viewport', 'missing-canonical', 'robots-restriction'].includes(issue.type)
  );

  const onPageIssues = issues.filter((issue: AuditIssue) =>
    ['missing-title', 'empty-title', 'short-title', 'long-title',
     'missing-meta-description', 'short-meta-description', 'long-meta-description',
     'missing-h1', 'multiple-h1', 'no-h2-headings'].includes(issue.type)
  );

  const semanticIssues = issues.filter((issue: AuditIssue) =>
    ['missing-og-tags', 'missing-image-alt', 'few-internal-links',
     'missing-structured-data', 'thin-content'].includes(issue.type)
  );

  return {
    id: data.id,
    url: data.url,
    created_at: data.created_at,
    status: data.status,
    user_id: data.user_id,
    score: data.result_json?.score || 0,
    issues: issues,
    recommendations: data.result_json?.recommendations || [],
    metadata: data.result_json?.metadata,
    email: data.result_json?.email,
    technicalSEO: {
      issues: technicalIssues
    },
    onPageSEO: {
      issues: onPageIssues
    },
    semanticSEO: {
      issues: semanticIssues
    },
    overallRecommendations: [],
    geographic: data.result_json?.geographic,
    voiceSearch: data.result_json?.voiceSearch,
    competitive: data.result_json?.competitive
  };
}

export async function trackClickToCall(auditId: string, userId?: string) {
  const { error } = await supabase
    .from('audit_events')
    .insert({
      audit_id: auditId,
      user_id: userId,
      event_type: 'click_to_call',
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  if (error) {
    console.error('Failed to track click to call:', error);
  }
}
