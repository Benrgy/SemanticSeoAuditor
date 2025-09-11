import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Download, Share, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getAuditById } from '../services/auditService';
import { useNotification } from '../contexts/NotificationContext';
import { trackClickToCall } from '../services/auditService';
import { useAuth } from '../contexts/AuthContext';

interface AuditReport {
  id: string;
  url: string;
  status: string;
  created_at: string;
  score: number;
  technicalSEO: any;
  onPageSEO: any;
  semanticSEO: any;
}

const AuditReport: React.FC = () => {
  const { auditId } = useParams<{ auditId: string }>();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'technical' | 'onpage' | 'semantic'>('technical');
  const { addNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    console.log('AuditReport mounted, auditId:', auditId);
    loadReport();
  }, [auditId]);

  const loadReport = async () => {
    if (!auditId) {
      console.error('No auditId provided');
      addNotification('error', 'Invalid audit ID');
      return;
    }
    
    console.log('Loading report for audit:', auditId);
    try {
      setLoading(true);
      const auditData = await getAuditById(auditId);
      console.log('Loaded audit data:', auditData);
      setReport(auditData);
    } catch (error) {
      console.error('Failed to load report:', error);
      addNotification('error', `Failed to load audit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCallExpert = async () => {
    // Track click-to-call event for affiliate attribution
    if (auditId) {
      await trackClickToCall(auditId, user?.id);
    }
    
    addNotification('info', 'Connecting you with an SEO expert...');
    
    // In production, this would integrate with Twilio or similar
    if ('navigator' in window && 'clipboard' in navigator) {
      navigator.clipboard.writeText('+1-555-SEO-HELP');
      addNotification('success', 'Expert phone number copied to clipboard: +1-555-SEO-HELP');
    }
    
    // Simulate call initiation (in production, would use actual phone API)
    setTimeout(() => {
      addNotification('success', 'Call initiated! An SEO expert will contact you shortly.');
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const renderIssueList = (issues: any[], title: string) => {
    if (!issues || issues.length === 0) {
      return (
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span>No issues found</span>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-white">{title}</h4>
        {issues.map((issue, index) => (
          <div key={index} className="border border-gray-600 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              {issue.severity === 'high' ? (
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              ) : issue.severity === 'medium' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h5 className="font-medium text-white">{issue.title}</h5>
                <p className="text-gray-400 text-sm mt-1">{issue.description}</p>
                  {issue.priority && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.priority === 'high' ? 'bg-red-900 text-red-200' :
                      issue.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-blue-900 text-blue-200'
                    }`}>
                      {issue.priority.toUpperCase()} PRIORITY
                    </span>
                  )}
                {issue.recommendation && (
                  <div className="mt-2 p-2 bg-gray-700 rounded text-sm">
                    <span className="text-blue-400 font-medium">Recommendation:</span>
                    <p className="text-gray-300 mt-1">{issue.recommendation}</p>
                  </div>
                )}
                {issue.implementationSteps && (
                  <div className="mt-3 p-3 bg-gray-800 rounded text-sm">
                    <span className="text-green-400 font-medium">Implementation Steps:</span>
                    <ul className="text-gray-300 mt-2 space-y-1">
                      {issue.implementationSteps.map((step: string, stepIndex: number) => (
                        <li key={stepIndex} className="text-xs">{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {issue.expectedImpact && (
                  <div className="mt-2 p-2 bg-blue-900/20 border border-blue-800 rounded text-sm">
                    <span className="text-blue-300 font-medium">Expected Impact:</span>
                    <p className="text-blue-200 mt-1 text-xs">{issue.expectedImpact}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Report not found</h2>
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">SEO Audit Report</h1>
              <p className="text-gray-400">{report.url}</p>
              <p className="text-sm text-gray-500">
                Analyzed on {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={handleCallExpert}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Expert
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                <Share className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Overall SEO Score</h2>
              <p className="text-gray-400">Your website's SEO performance</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(report.score)}`}>
                {report.score}/100
              </div>
              <div className="w-24 h-2 bg-gray-700 rounded-full mt-2">
                <div 
                  className={`h-full bg-gradient-to-r ${getScoreGradient(report.score)} rounded-full`}
                  style={{ width: `${report.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analysis Summary */}
        {(report.contentAnalysis || report.technicalAnalysis || report.competitiveAnalysis) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {report.contentAnalysis && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Content Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Topic Relevance</span>
                    <span className="text-white font-medium">{report.contentAnalysis.topicRelevance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Content Depth</span>
                    <span className="text-white font-medium">{report.contentAnalysis.contentDepth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Readability</span>
                    <span className="text-white font-medium">{report.contentAnalysis.readabilityScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Key Entities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {report.contentAnalysis.entityRecognition.map((entity, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {report.technicalAnalysis && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Technical Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mobile Score</span>
                    <span className="text-white font-medium">{report.technicalAnalysis.mobileScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">LCP</span>
                    <span className={`font-medium ${report.technicalAnalysis.coreWebVitals.lcp > 2.5 ? 'text-red-400' : 'text-green-400'}`}>
                      {report.technicalAnalysis.coreWebVitals.lcp.toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Internal Links</span>
                    <span className="text-white font-medium">{report.technicalAnalysis.internalLinks}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Schema Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {report.technicalAnalysis.schemaMarkup.map((schema, index) => (
                        <span key={index} className="px-2 py-1 bg-green-900 text-green-200 text-xs rounded">
                          {schema}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {report.competitiveAnalysis && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Competitive Insights</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Content Gaps:</span>
                    <ul className="text-white text-xs mt-1 space-y-1">
                      {report.competitiveAnalysis.contentGaps.slice(0, 2).map((gap, index) => (
                        <li key={index}>• {gap}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Keyword Opportunities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {report.competitiveAnalysis.keywordOpportunities.slice(0, 2).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-900 text-purple-200 text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex">
              {[
                { id: 'technical', label: 'Technical SEO', count: report.technicalSEO?.issues?.length || 0 },
                { id: 'onpage', label: 'On-Page SEO', count: report.onPageSEO?.issues?.length || 0 },
                { id: 'semantic', label: 'Semantic SEO', count: report.semanticSEO?.issues?.length || 0 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'technical' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Technical SEO Analysis</h3>
                {renderIssueList(report.technicalSEO?.issues, 'Technical Issues')}
              </div>
            )}

            {activeTab === 'onpage' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">On-Page SEO Analysis</h3>
                {renderIssueList(report.onPageSEO?.issues, 'On-Page Issues')}
              </div>
            )}

            {activeTab === 'semantic' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Semantic SEO Analysis</h3>
                {renderIssueList(report.semanticSEO?.issues, 'Content & Semantic Issues')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;