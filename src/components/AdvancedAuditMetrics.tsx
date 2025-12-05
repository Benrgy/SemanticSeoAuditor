import React from 'react';
import { Zap, Globe, TrendingUp, Target } from 'lucide-react';

interface AdvancedMetricsProps {
  technicalScore?: number;
  onPageScore?: number;
  contentScore?: number;
  linkScore?: number;
  aiOverviewScore?: number;
  geoTargetingScore?: number;
  competitiveScore?: number;
  checkpointsPassed?: number;
  checkpointsFailed?: number;
}

export const AdvancedAuditMetrics: React.FC<AdvancedMetricsProps> = ({
  technicalScore = 0,
  onPageScore = 0,
  contentScore = 0,
  linkScore = 0,
  aiOverviewScore = 0,
  geoTargetingScore = 0,
  competitiveScore = 0,
  checkpointsPassed = 0,
  checkpointsFailed = 0
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgGradient = (score: number) => {
    if (score >= 80) return 'from-green-500/10 to-green-600/10 border-green-500/20';
    if (score >= 60) return 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20';
    return 'from-red-500/10 to-red-600/10 border-red-500/20';
  };

  const metrics = [
    { label: 'Technical SEO', score: technicalScore, icon: Zap },
    { label: 'On-Page SEO', score: onPageScore, icon: Target },
    { label: 'Content Quality', score: contentScore, icon: TrendingUp },
    { label: 'Link Building', score: linkScore, icon: TrendingUp },
  ];

  const advancedMetrics = [
    { label: 'AI Overview', score: aiOverviewScore, icon: Zap },
    { label: 'Geo-Targeting', score: geoTargetingScore, icon: Globe },
    { label: 'Competitive', score: competitiveScore, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Core SEO Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${getScoreBgGradient(metric.score)} border rounded-lg p-6 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium">{metric.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${getScoreColor(metric.score)}`}>
                      {metric.score}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${getScoreColor(metric.score)}`} />
                </div>
                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      metric.score >= 80 ? 'bg-green-500' : metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Advanced Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advancedMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${getScoreBgGradient(metric.score)} border rounded-lg p-6 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium">{metric.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${getScoreColor(metric.score)}`}>
                      {metric.score}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${getScoreColor(metric.score)}`} />
                </div>
                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      metric.score >= 80 ? 'bg-green-500' : metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(checkpointsPassed || checkpointsFailed) && (
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Checkpoint Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-950/40 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Checkpoints Passed</p>
              <p className="text-2xl font-bold text-green-400 mt-2">{checkpointsPassed}</p>
            </div>
            <div className="bg-blue-950/40 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Checkpoints Failed</p>
              <p className="text-2xl font-bold text-red-400 mt-2">{checkpointsFailed}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-300">
            Coverage: {Math.round((checkpointsPassed / (checkpointsPassed + checkpointsFailed)) * 100)}% of analyzed checkpoints passed
          </div>
        </div>
      )}
    </div>
  );
};
