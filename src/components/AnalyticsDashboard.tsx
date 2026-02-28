import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Users, FileText, Clock, Target, Zap } from 'lucide-react';
import { Card } from './ui/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsData {
  totalAudits: number;
  auditsThisMonth: number;
  averageScore: number;
  improvementRate: number;
  topIssues: Array<{ issue: string; count: number }>;
  auditTrend: Array<{ date: string; count: number; avgScore: number }>;
  usageStats: {
    auditsUsed: number;
    auditsLimit: number;
    apiCallsUsed: number;
    apiCallsLimit: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data: audits, error: auditsError } = await supabase
        .from('seo_audits')
        .select('id, url, score, issues, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (auditsError) throw auditsError;

      const auditsThisMonth = audits?.filter(
        audit => new Date(audit.created_at) >= firstDayOfMonth
      ) || [];

      const avgScore = audits && audits.length > 0
        ? audits.reduce((sum, a) => sum + (a.score || 0), 0) / audits.length
        : 0;

      const lastMonthAudits = audits?.filter(audit => {
        const auditDate = new Date(audit.created_at);
        return auditDate < firstDayOfMonth && auditDate >= new Date(firstDayOfMonth.getTime() - 30 * 24 * 60 * 60 * 1000);
      }) || [];

      const lastMonthAvg = lastMonthAudits.length > 0
        ? lastMonthAudits.reduce((sum, a) => sum + (a.score || 0), 0) / lastMonthAudits.length
        : avgScore;

      const improvementRate = lastMonthAvg > 0 ? ((avgScore - lastMonthAvg) / lastMonthAvg) * 100 : 0;

      const issueMap = new Map<string, number>();
      audits?.forEach(audit => {
        if (audit.issues && Array.isArray(audit.issues)) {
          audit.issues.forEach((issue: any) => {
            const key = issue.type || issue.category || 'Unknown';
            issueMap.set(key, (issueMap.get(key) || 0) + 1);
          });
        }
      });

      const topIssues = Array.from(issueMap.entries())
        .map(([issue, count]) => ({ issue, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const auditTrend = last7Days.map(date => {
        const dayAudits = audits?.filter(
          audit => audit.created_at.startsWith(date)
        ) || [];
        const avgScore = dayAudits.length > 0
          ? dayAudits.reduce((sum, a) => sum + (a.score || 0), 0) / dayAudits.length
          : 0;
        return { date, count: dayAudits.length, avgScore };
      });

      const { data: usageLimits } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user?.id)
        .lte('period_start', new Date().toISOString())
        .gte('period_end', new Date().toISOString())
        .maybeSingle();

      setAnalytics({
        totalAudits: audits?.length || 0,
        auditsThisMonth: auditsThisMonth.length,
        averageScore: Math.round(avgScore),
        improvementRate: Math.round(improvementRate),
        topIssues,
        auditTrend,
        usageStats: {
          auditsUsed: usageLimits?.audits_used || 0,
          auditsLimit: usageLimits?.audits_limit || 10,
          apiCallsUsed: usageLimits?.api_calls_used || 0,
          apiCallsLimit: usageLimits?.api_calls_limit || 100,
        },
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center py-8 text-gray-500">No analytics data available</div>;
  }

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  const usagePercentage = (analytics.usageStats.auditsUsed / analytics.usageStats.auditsLimit) * 100;
  const apiUsagePercentage = (analytics.usageStats.apiCallsUsed / analytics.usageStats.apiCallsLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your SEO performance and usage metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Audits"
          value={analytics.totalAudits}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="This Month"
          value={analytics.auditsThisMonth}
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
        />
        <StatCard
          title="Avg Score"
          value={`${analytics.averageScore}/100`}
          change={analytics.improvementRate}
          icon={<Target className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Improvement"
          value={`${analytics.improvementRate > 0 ? '+' : ''}${analytics.improvementRate}%`}
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Audit Trend (Last 7 Days)</h3>
          </div>
          <div className="space-y-3">
            {analytics.auditTrend.map((day, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.min((day.count / Math.max(...analytics.auditTrend.map(d => d.count), 1)) * 100, 100)}%` }}
                    >
                      {day.count > 0 && (
                        <span className="text-xs text-white font-medium">{day.count}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium text-gray-900">
                  {day.avgScore > 0 ? `${Math.round(day.avgScore)}%` : '-'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Top Issues Found</h3>
          </div>
          {analytics.topIssues.length > 0 ? (
            <div className="space-y-3">
              {analytics.topIssues.map((issue, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 font-medium">{issue.issue}</span>
                      <span className="text-sm text-gray-500">{issue.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                        style={{ width: `${(issue.count / Math.max(...analytics.topIssues.map(i => i.count), 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No issues detected yet</p>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Users className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Usage Limits</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Audits</span>
              <span className="text-sm text-gray-600">
                {analytics.usageStats.auditsUsed} / {analytics.usageStats.auditsLimit === -1 ? 'Unlimited' : analytics.usageStats.auditsLimit}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">API Calls</span>
              <span className="text-sm text-gray-600">
                {analytics.usageStats.apiCallsUsed} / {analytics.usageStats.apiCallsLimit === -1 ? 'Unlimited' : analytics.usageStats.apiCallsLimit}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  apiUsagePercentage > 90 ? 'bg-red-500' : apiUsagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(apiUsagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
