import { supabase } from '../lib/supabase';

export interface WebhookConfig {
  id: string;
  user_id: string;
  name: string;
  type: 'slack' | 'discord' | 'email' | 'custom';
  url: string;
  events: string[];
  enabled: boolean;
  created_at: string;
}

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: {
    audit_id?: string;
    url?: string;
    score?: number;
    status?: string;
    user_email?: string;
    [key: string]: any;
  };
}

export async function getWebhooksForUser(userId: string): Promise<WebhookConfig[]> {
  const { data, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createWebhook(config: Omit<WebhookConfig, 'id' | 'created_at'>): Promise<WebhookConfig> {
  const { data, error } = await supabase
    .from('webhooks')
    .insert(config)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWebhook(id: string, updates: Partial<WebhookConfig>): Promise<WebhookConfig> {
  const { data, error } = await supabase
    .from('webhooks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWebhook(id: string): Promise<void> {
  const { error } = await supabase
    .from('webhooks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function triggerWebhook(config: WebhookConfig, payload: WebhookPayload): Promise<void> {
  if (!config.enabled) return;
  if (!config.events.includes(payload.event)) return;

  try {
    let body: any = payload;

    if (config.type === 'slack') {
      body = formatSlackMessage(payload);
    } else if (config.type === 'discord') {
      body = formatDiscordMessage(payload);
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    await logWebhookExecution(config.id, 'success', payload);
  } catch (error) {
    console.error('Webhook execution failed:', error);
    await logWebhookExecution(config.id, 'failed', payload, error instanceof Error ? error.message : 'Unknown error');
  }
}

function formatSlackMessage(payload: WebhookPayload): any {
  const { event, data } = payload;

  let text = '';
  let color = '#36a64f';

  switch (event) {
    case 'audit.completed':
      text = `SEO Audit Completed for ${data.url}`;
      color = data.score && data.score >= 80 ? '#36a64f' : data.score && data.score >= 60 ? '#ff9900' : '#ff0000';
      break;
    case 'audit.failed':
      text = `SEO Audit Failed for ${data.url}`;
      color = '#ff0000';
      break;
    case 'usage.limit_reached':
      text = `Usage Limit Reached`;
      color = '#ff9900';
      break;
    default:
      text = `Event: ${event}`;
  }

  return {
    text,
    attachments: [
      {
        color,
        fields: Object.entries(data)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => ({
            title: key.replace(/_/g, ' ').toUpperCase(),
            value: String(value),
            short: true,
          })),
        footer: 'SEO Auditor',
        ts: Math.floor(new Date(payload.timestamp).getTime() / 1000),
      },
    ],
  };
}

function formatDiscordMessage(payload: WebhookPayload): any {
  const { event, data } = payload;

  let title = '';
  let description = '';
  let color = 3066993;

  switch (event) {
    case 'audit.completed':
      title = 'SEO Audit Completed';
      description = `Audit completed for **${data.url}**`;
      color = data.score && data.score >= 80 ? 3066993 : data.score && data.score >= 60 ? 16761600 : 15158332;
      break;
    case 'audit.failed':
      title = 'SEO Audit Failed';
      description = `Audit failed for **${data.url}**`;
      color = 15158332;
      break;
    case 'usage.limit_reached':
      title = 'Usage Limit Reached';
      description = 'You have reached your usage limit';
      color = 16761600;
      break;
    default:
      title = event;
      description = 'Event triggered';
  }

  return {
    embeds: [
      {
        title,
        description,
        color,
        fields: Object.entries(data)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => ({
            name: key.replace(/_/g, ' ').toUpperCase(),
            value: String(value),
            inline: true,
          })),
        footer: {
          text: 'SEO Auditor',
        },
        timestamp: payload.timestamp,
      },
    ],
  };
}

async function logWebhookExecution(
  webhookId: string,
  status: 'success' | 'failed',
  payload: WebhookPayload,
  error?: string
): Promise<void> {
  try {
    await supabase.from('webhook_logs').insert({
      webhook_id: webhookId,
      status,
      event: payload.event,
      payload: payload,
      error_message: error,
    });
  } catch (err) {
    console.error('Failed to log webhook execution:', err);
  }
}

export async function triggerWebhooksForEvent(
  userId: string,
  event: string,
  data: WebhookPayload['data']
): Promise<void> {
  try {
    const webhooks = await getWebhooksForUser(userId);

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const promises = webhooks.map(webhook => triggerWebhook(webhook, payload));
    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Failed to trigger webhooks:', error);
  }
}

export async function testWebhook(config: WebhookConfig): Promise<boolean> {
  try {
    const testPayload: WebhookPayload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook from SEO Auditor',
      },
    };

    await triggerWebhook(config, testPayload);
    return true;
  } catch (error) {
    console.error('Webhook test failed:', error);
    return false;
  }
}
