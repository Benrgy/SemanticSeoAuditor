import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  details?: string;
}

export default function DiagnosticsPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Environment Variables', status: 'pending' },
    { name: 'Supabase Connection', status: 'pending' },
    { name: 'Edge Function', status: 'pending' },
    { name: 'CORS Test', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, update: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...update } : test));
  };

  const runDiagnostics = async () => {
    setIsRunning(true);

    // Test 1: Environment Variables
    updateTest(0, { status: 'running' });
    await new Promise(resolve => setTimeout(resolve, 500));

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      updateTest(0, {
        status: 'error',
        message: 'Missing environment variables',
        details: 'Check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
      });
      setIsRunning(false);
      return;
    }

    updateTest(0, {
      status: 'success',
      message: 'All environment variables present',
      details: `URL: ${supabaseUrl.substring(0, 30)}...`
    });

    // Test 2: Supabase Connection
    updateTest(1, { status: 'running' });
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from('audits')
        .select('count')
        .limit(0)
        .maybeSingle();

      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          updateTest(1, {
            status: 'error',
            message: 'Database tables not created',
            details: 'Run migrations in Supabase SQL Editor (see SETUP_GUIDE.md)'
          });
        } else {
          updateTest(1, {
            status: 'error',
            message: 'Database connection failed',
            details: error.message
          });
        }
      } else {
        updateTest(1, {
          status: 'success',
          message: 'Connected to Supabase database',
          details: 'Tables exist and are accessible'
        });
      }
    } catch (err) {
      updateTest(1, {
        status: 'error',
        message: 'Connection error',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    // Test 3: Edge Function
    updateTest(2, { status: 'running' });
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const functionUrl = `${supabaseUrl}/functions/v1/run-seo-audit`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ url: 'https://example.com' }),
      });

      if (response.status === 404) {
        updateTest(2, {
          status: 'error',
          message: 'Edge function not deployed',
          details: 'Run: supabase functions deploy run-seo-audit'
        });
      } else if (response.ok) {
        const result = await response.json();
        updateTest(2, {
          status: 'success',
          message: 'Edge function is working',
          details: `Returned score: ${result.score || 'N/A'}`
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        updateTest(2, {
          status: 'error',
          message: `Edge function error (${response.status})`,
          details: errorData.error || errorData.message || 'Unknown error'
        });
      }
    } catch (err) {
      updateTest(2, {
        status: 'error',
        message: 'Cannot reach edge function',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
    }

    // Test 4: CORS Test
    updateTest(3, { status: 'running' });
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const response = await fetch('https://example.com', {
        mode: 'cors',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (response.ok) {
        updateTest(3, {
          status: 'success',
          message: 'Direct fetch works for example.com',
          details: 'Fallback mode will work for some websites'
        });
      } else {
        updateTest(3, {
          status: 'error',
          message: `HTTP ${response.status}`,
          details: 'Direct fetch may not work reliably'
        });
      }
    } catch (err) {
      updateTest(3, {
        status: 'error',
        message: 'CORS blocked',
        details: 'Edge function required for most websites'
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Diagnostics</h1>
          <p className="text-gray-600">
            Run diagnostics to identify issues with your SEO audit setup
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Diagnostic Tests</h2>
            <Button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                'Run Diagnostics'
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {test.name}
                    </h3>
                    {test.message && (
                      <p className={`text-sm mb-1 ${
                        test.status === 'error' ? 'text-red-600' :
                        test.status === 'success' ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {test.message}
                      </p>
                    )}
                    {test.details && (
                      <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                        {test.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Fix Guide</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>If Environment Variables fail:</strong> Check your .env file</p>
            <p><strong>If Supabase Connection fails:</strong> Run migrations in Supabase SQL Editor</p>
            <p><strong>If Edge Function fails:</strong> Deploy with: <code className="bg-blue-100 px-2 py-1 rounded">supabase functions deploy run-seo-audit</code></p>
            <p><strong>If CORS Test fails:</strong> This is expected - edge function will handle it</p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-900">
              For detailed setup instructions, see <code className="bg-blue-100 px-2 py-1 rounded">SETUP_GUIDE.md</code>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
