import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Power, Check, X, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import {
  getWebhooksForUser,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
  WebhookConfig,
} from '../services/webhookService';

const WebhooksPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'slack' as const,
    url: '',
    events: [] as string[],
  });

  const availableEvents = [
    { id: 'audit.completed', label: 'Audit Completed' },
    { id: 'audit.failed', label: 'Audit Failed' },
    { id: 'audit.started', label: 'Audit Started' },
    { id: 'usage.limit_reached', label: 'Usage Limit Reached' },
    { id: 'usage.limit_warning', label: 'Usage Limit Warning (80%)' },
  ];

  useEffect(() => {
    if (user) {
      loadWebhooks();
    }
  }, [user]);

  const loadWebhooks = async () => {
    try {
      setLoading(true);
      const data = await getWebhooksForUser(user!.id);
      setWebhooks(data);
    } catch (error) {
      addNotification('error', 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || formData.events.length === 0) {
      addNotification('error', 'Please fill in all fields');
      return;
    }

    try {
      await createWebhook({
        user_id: user!.id,
        name: formData.name,
        type: formData.type,
        url: formData.url,
        events: formData.events,
        enabled: true,
      });

      addNotification('success', 'Webhook created successfully');
      setShowAddModal(false);
      setFormData({ name: '', type: 'slack', url: '', events: [] });
      loadWebhooks();
    } catch (error) {
      addNotification('error', 'Failed to create webhook');
    }
  };

  const handleToggle = async (webhook: WebhookConfig) => {
    try {
      await updateWebhook(webhook.id, { enabled: !webhook.enabled });
      addNotification('success', `Webhook ${webhook.enabled ? 'disabled' : 'enabled'}`);
      loadWebhooks();
    } catch (error) {
      addNotification('error', 'Failed to update webhook');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    try {
      await deleteWebhook(id);
      addNotification('success', 'Webhook deleted successfully');
      loadWebhooks();
    } catch (error) {
      addNotification('error', 'Failed to delete webhook');
    }
  };

  const handleTest = async (webhook: WebhookConfig) => {
    try {
      const success = await testWebhook(webhook);
      if (success) {
        addNotification('success', 'Test webhook sent successfully');
      } else {
        addNotification('error', 'Test webhook failed');
      }
    } catch (error) {
      addNotification('error', 'Failed to send test webhook');
    }
  };

  const toggleEvent = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  const getWebhookTypeColor = (type: string) => {
    switch (type) {
      case 'slack':
        return 'bg-purple-600';
      case 'discord':
        return 'bg-indigo-600';
      case 'email':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Webhook Integrations</h1>
            <p className="text-gray-400">Connect your favorite tools to receive real-time notifications</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        {webhooks.length === 0 ? (
          <Card className="p-12 text-center bg-gray-800 border-gray-700">
            <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Webhooks Yet</h3>
            <p className="text-gray-400 mb-6">
              Get started by adding your first webhook integration
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Webhook
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {webhooks.map(webhook => (
              <Card key={webhook.id} className="p-6 bg-gray-800 border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getWebhookTypeColor(webhook.type)} mr-3`}>
                        {webhook.type}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{webhook.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 font-mono">{webhook.url}</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map(event => (
                        <span key={event} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggle(webhook)}
                      className={`p-2 rounded-lg transition-colors ${
                        webhook.enabled
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                      }`}
                      title={webhook.enabled ? 'Disable' : 'Enable'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTest(webhook)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Test Webhook"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(webhook.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Add Webhook</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Webhook Name
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Slack Webhook"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="slack">Slack</option>
                      <option value="discord">Discord</option>
                      <option value="email">Email</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Webhook URL
                    </label>
                    <Input
                      type="url"
                      value={formData.url}
                      onChange={e => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://hooks.slack.com/services/..."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Events</label>
                    <div className="space-y-2">
                      {availableEvents.map(event => (
                        <label key={event.id} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.events.includes(event.id)}
                            onChange={() => toggleEvent(event.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-300 group-hover:text-white">
                            {event.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Check className="w-4 h-4 mr-2" />
                      Create Webhook
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhooksPage;
