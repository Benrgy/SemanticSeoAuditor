import { supabase } from '../lib/supabase';

export interface AuditResult {
  id: string;
  score: number;
  issues: AuditIssue[];
  recommendations: string[];
}

export interface AuditIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  element?: string;
}

export async function performAudit(url: string): Promise<Omit<AuditResult, 'id'>> {
  const issues: AuditIssue[] = [];
  const recommendations: string[] = [];

  try {
    const response = await fetch(url);
    const html = await response.text();

    const hasTitle = /<title>.*?<\/title>/i.test(html);
    if (!hasTitle) {
      issues.push({
        type: 'missing-title',
        severity: 'high',
        description: 'Page is missing a title tag',
      });
      recommendations.push('Add a descriptive title tag to improve SEO');
    }

    const hasMetaDescription = /<meta\s+name=["']description["']/i.test(html);
    if (!hasMetaDescription) {
      issues.push({
        type: 'missing-meta-description',
        severity: 'high',
        description: 'Page is missing a meta description',
      });
      recommendations.push('Add a meta description to improve search engine visibility');
    }

    const hasH1 = /<h1.*?>.*?<\/h1>/i.test(html);
    if (!hasH1) {
      issues.push({
        type: 'missing-h1',
        severity: 'medium',
        description: 'Page is missing an H1 heading',
      });
      recommendations.push('Add an H1 heading to establish page hierarchy');
    }

    const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
    if (!hasViewport) {
      issues.push({
        type: 'missing-viewport',
        severity: 'medium',
        description: 'Page is missing viewport meta tag',
      });
      recommendations.push('Add viewport meta tag for mobile responsiveness');
    }

    const score = Math.max(0, 100 - issues.length * 15);

    return {
      score,
      issues,
      recommendations,
    };
  } catch (error) {
    throw new Error(`Failed to audit URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      email,
      user_id: userId,
      score: auditData.score,
      issues: auditData.issues,
      recommendations: auditData.recommendations,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save audit: ${error.message}`);
  }

  return {
    id: data.id,
    score: data.score,
    issues: data.issues,
    recommendations: data.recommendations,
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

  return data;
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

  return data;
}

export async function trackClickToCall(auditId: string) {
  const { error } = await supabase
    .from('audit_events')
    .insert({
      audit_id: auditId,
      event_type: 'click_to_call',
    });

  if (error) {
    console.error('Failed to track click to call:', error);
  }
}
