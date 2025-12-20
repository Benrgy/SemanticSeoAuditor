import { Target, TrendingUp, Link, BarChart3, AlertTriangle } from 'lucide-react';
import { CompetitiveAnalysis } from '../services/competitiveAnalyzer';
import { Card } from './ui/Card';

interface CompetitiveAnalysisCardProps {
  analysis: CompetitiveAnalysis;
}

export function CompetitiveAnalysisCard({ analysis }: CompetitiveAnalysisCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-semibold">Competitive Intelligence</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Domain Authority</div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.domainMetrics.estimatedAuthority)}`}>
              {analysis.domainMetrics.estimatedAuthority}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Content Quality</div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.domainMetrics.contentQuality)}`}>
              {analysis.domainMetrics.contentQuality}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Technical SEO</div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.domainMetrics.technicalSEO)}`}>
              {analysis.domainMetrics.technicalSEO}
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium">Backlink Profile</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Estimated Backlinks</div>
              <div className="text-xl font-bold text-blue-700">
                {analysis.backlinkComparison.estimatedBacklinks.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Quality Rating</div>
              <div className={`text-xl font-bold capitalize ${
                analysis.backlinkComparison.quality === 'high'
                  ? 'text-green-600'
                  : analysis.backlinkComparison.quality === 'medium'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {analysis.backlinkComparison.quality}
              </div>
            </div>
          </div>
        </div>

        {analysis.contentGaps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium">Content Gaps</h4>
            </div>
            <div className="space-y-2">
              {analysis.contentGaps.map((gap, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    gap.priority === 'high'
                      ? 'border-red-200 bg-red-50'
                      : gap.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{gap.topic}</span>
                    <span className={`text-xs px-2 py-1 rounded capitalize ${
                      gap.priority === 'high'
                        ? 'bg-red-200 text-red-800'
                        : gap.priority === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {gap.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 mb-1">{gap.description}</div>
                  <div className="text-xs text-gray-600 italic">{gap.opportunity}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.keywordOpportunities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium">Keyword Opportunities</h4>
            </div>
            <div className="space-y-2">
              {analysis.keywordOpportunities.map((keyword, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{keyword.keyword}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Vol: {keyword.searchVolume}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        keyword.difficulty <= 35
                          ? 'bg-green-200 text-green-800'
                          : keyword.difficulty <= 60
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        Diff: {keyword.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-700 mb-1">{keyword.reason}</div>
                  <div className="text-xs text-gray-500">Intent: {keyword.intent}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.competitorStrengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium">Your Strengths</h4>
            </div>
            <div className="space-y-2">
              {analysis.competitorStrengths.map((strength, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-sm mb-1">{strength.area}</div>
                  <div className="text-xs text-gray-700 mb-1">{strength.description}</div>
                  <div className="text-xs text-blue-700 font-medium">{strength.actionItem}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.serpPositions.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Estimated SERP Positions</h4>
            <div className="space-y-2">
              {analysis.serpPositions.map((serp, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{serp.keyword}</span>
                    <span className={`text-lg font-bold ${
                      serp.estimatedPosition <= 3
                        ? 'text-green-600'
                        : serp.estimatedPosition <= 10
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}>
                      #{serp.estimatedPosition}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{serp.opportunity}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.backlinkComparison.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Backlink Recommendations</h4>
            <ul className="space-y-2">
              {analysis.backlinkComparison.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
