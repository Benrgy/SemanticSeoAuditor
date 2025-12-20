import { Globe, MapPin, Languages, AlertCircle } from 'lucide-react';
import { GeographicAnalysis } from '../services/geographicAnalyzer';
import { Card } from './ui/Card';

interface GeographicAnalysisCardProps {
  analysis: GeographicAnalysis;
}

export function GeographicAnalysisCard({ analysis }: GeographicAnalysisCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold">Geographic Targeting</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600 mb-1">Local SEO Score</div>
            <div className={`text-3xl font-bold ${getScoreColor(analysis.localSeoScore)}`}>
              {analysis.localSeoScore}
            </div>
          </div>
          <MapPin className={`w-12 h-12 ${getScoreColor(analysis.localSeoScore)}`} />
        </div>

        {analysis.languagesDetected.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium">Languages Detected</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.languagesDetected.map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis.regionsDetected.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Regions Targeted</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.regionsDetected.map((region, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis.hreflangTags.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Hreflang Tags</h4>
            <div className="space-y-2">
              {analysis.hreflangTags.map((tag, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    tag.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm">{tag.lang}</span>
                      {tag.region && (
                        <span className="ml-2 text-sm text-gray-600">({tag.region})</span>
                      )}
                    </div>
                    {!tag.isValid && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 truncate">{tag.href}</div>
                  {tag.issues && tag.issues.length > 0 && (
                    <div className="mt-2 text-xs text-red-600">{tag.issues.join(', ')}</div>
                  )}
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
                  <div className="font-medium text-sm">{issue.description}</div>
                  <div className="text-xs text-gray-600 mt-1">{issue.recommendation}</div>
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
                  <span className="text-blue-600 mt-1">•</span>
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
