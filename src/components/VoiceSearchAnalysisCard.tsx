import { Mic, MessageCircle, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { VoiceSearchAnalysis } from '../services/voiceSearchAnalyzer';
import { Card } from './ui/Card';

interface VoiceSearchAnalysisCardProps {
  analysis: VoiceSearchAnalysis;
}

export function VoiceSearchAnalysisCard({ analysis }: VoiceSearchAnalysisCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Mic className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold">Voice Search Optimization</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Featured Snippet Score</div>
            <div className={`text-3xl font-bold ${getScoreColor(analysis.featuredSnippetScore)}`}>
              {analysis.featuredSnippetScore}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Answer Readiness</div>
            <div className={`text-3xl font-bold ${getScoreColor(analysis.answerReadinessScore)}`}>
              {analysis.answerReadinessScore}
            </div>
          </div>
        </div>

        {analysis.questionPatterns.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium">Question Patterns Detected</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {analysis.questionPatterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-lg font-bold text-purple-700">{pattern.type.toUpperCase()}</div>
                  <div className="text-sm text-gray-600">{pattern.count} occurrences</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.conversationalKeywords.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium">Conversational Keywords</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.conversationalKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis.longTailOpportunities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium">Long-Tail Opportunities</h4>
            </div>
            <div className="space-y-2">
              {analysis.longTailOpportunities.map((opp, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{opp.keyword}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        opp.difficulty === 'low'
                          ? 'bg-green-200 text-green-800'
                          : opp.difficulty === 'medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {opp.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{opp.opportunity}</div>
                  <div className="text-xs text-gray-500 mt-1">Intent: {opp.intent}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.issues.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Issues Found</h4>
            <div className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    issue.severity === 'high'
                      ? 'border-red-200 bg-red-50'
                      : issue.severity === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{issue.description}</div>
                      <div className="text-xs text-gray-600 mt-1">{issue.recommendation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600 mt-1">•</span>
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
