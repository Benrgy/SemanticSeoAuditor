import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

interface APIKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  last_used: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

const APIKeysPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAPIKeys();
    }
  }, [user]);

  const loadAPIKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      addNotification('error', 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateAPIKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'sk_';
    for (let i = 0; i < 48; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newKeyName.trim()) {
      addNotification('error', 'Please enter a key name');
      return;
    }

    try {
      const apiKey = generateAPIKey();
      const prefix = apiKey.substring(0, 12);

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user!.id,
          name: newKeyName,
          key: apiKey,
          prefix: prefix,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setNewlyCreatedKey(apiKey);
      addNotification('success', 'API key created successfully');
      setNewKeyName('');
      setShowAddModal(false);
      loadAPIKeys();
    } catch (error) {
      addNotification('error', 'Failed to create API key');
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addNotification('success', 'API key deleted successfully');
      loadAPIKeys();
    } catch (error) {
      addNotification('error', 'Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification('success', 'Copied to clipboard');
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '••••••••••••••••••••••••••••••••••••••';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
            <p className="text-gray-400">Manage your API keys for programmatic access</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </Button>
        </div>

        {newlyCreatedKey && (
          <Card className="p-6 mb-6 bg-green-900/20 border-green-700">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  API Key Created Successfully
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Make sure to copy your API key now. You won't be able to see it again!
                </p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-green-400 font-mono text-sm">
                    {newlyCreatedKey}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(newlyCreatedKey)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <button
                  onClick={() => setNewlyCreatedKey(null)}
                  className="mt-3 text-sm text-gray-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 mb-6 bg-blue-900/20 border-blue-700">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">API Documentation</h3>
          <p className="text-sm text-gray-300 mb-3">
            Use your API key to authenticate requests to our API. Include it in the Authorization header:
          </p>
          <code className="block px-4 py-2 bg-gray-800 border border-gray-700 rounded text-blue-400 font-mono text-sm">
            Authorization: Bearer YOUR_API_KEY
          </code>
          <p className="text-sm text-gray-400 mt-3">
            Base URL: <span className="text-white font-mono">{window.location.origin}/api/v1</span>
          </p>
        </Card>

        {apiKeys.length === 0 ? (
          <Card className="p-12 text-center bg-gray-800 border-gray-700">
            <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No API Keys Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first API key to start using our API
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First API Key
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {apiKeys.map(apiKey => (
              <Card key={apiKey.id} className="p-6 bg-gray-800 border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Key className="w-5 h-5 text-blue-400 mr-2" />
                      <h3 className="text-lg font-semibold text-white">{apiKey.name}</h3>
                      {!apiKey.is_active && (
                        <span className="ml-3 px-2 py-1 bg-red-900/20 text-red-400 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="px-3 py-1 bg-gray-900 rounded text-gray-300 font-mono text-sm">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-1 hover:bg-gray-700 rounded"
                        title={visibleKeys.has(apiKey.id) ? 'Hide' : 'Show'}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-1 hover:bg-gray-700 rounded"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>Created: {new Date(apiKey.created_at).toLocaleDateString()}</div>
                      {apiKey.last_used && (
                        <div>Last used: {new Date(apiKey.last_used).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="ml-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Create API Key</h2>
                <form onSubmit={handleCreateKey} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Name
                    </label>
                    <Input
                      type="text"
                      value={newKeyName}
                      onChange={e => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API Key"
                      className="bg-gray-700 border-gray-600 text-white"
                      autoFocus
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      Choose a descriptive name to help you identify this key later
                    </p>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setNewKeyName('');
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create Key
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

export default APIKeysPage;
