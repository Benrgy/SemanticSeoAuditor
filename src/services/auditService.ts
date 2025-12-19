import { supabase } from '../lib/supabase';

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
}

export interface AuditIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  element?: string;
}

export async function performAudit(url: string): Promise<Omit<AuditResult, 'id'>> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing');
    }

    const functionUrl = `${supabaseUrl}/functions/v1/run-seo-audit`;

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
      throw new Error(errorData.error || `Server returned ${response.status}`);
    }

    const result = await response.json();

    return {
      score: result.score,
      issues: result.issues,
      recommendations: result.recommendations,
      metadata: result.metadata,
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

  return {
    id: data.id,
    url: data.url,
    created_at: data.created_at,
    status: data.status,
    user_id: data.user_id,
    score: data.result_json?.score || 0,
    issues: data.result_json?.issues || [],
    recommendations: data.result_json?.recommendations || [],
    metadata: data.result_json?.metadata,
    email: data.result_json?.email,
  };
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
