import React, { useState } from 'react';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Calendar, 
  BarChart3,
  Shield,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const AIInsightsDashboard = ({aiInsights}) => {
  const [expandedSections, setExpandedSections] = useState({
    performance: true,
    predictions: true,
    actions: true,
    resources: true
  });

  const [activeTab, setActiveTab] = useState('ai-insights');
  const [insightsLoading] = useState(false);

  // Sample data structure based on your provided data
//   const aiInsights = {
//     insights: {
//       insightType: "Performance Analysis",
//       riskLevel: "high",
//       confidenceScore: 0.6,
//       analysisResult: "Current progress is 0.0% with -14 days remaining.",
//       predictionData: {
//         completionProbability: 10,
//         predictedCompletion: "2025-07-25",
//         riskLevel: "high"
//       }
//     },
//     performanceAnalysis: {
//       analysis: "Current progress is 0.0% with -14 days remaining. This indicates a critical situation requiring immediate attention and intervention.",
//       insights: [
//         "Monitor progress closely",
//         "Consider additional resources"
//       ],
//       completionProbability: 10,
//       confidenceScore: 0.6,
//       predictedCompletion: "2025-07-25",
//       riskLevel: "high"
//     },
//     improvementSuggestions: [
//       {
//         action: "Review current processes and identify bottlenecks",
//         impact: "Improved efficiency and faster progress",
//         priority: "high",
//         timeline: "1 week"
//       }
//     ],
//     resourceRecommendations: [
//       {
//         title: "Social Media Engagement Rate Best Practices Guide",
//         description: "Comprehensive guide covering best practices and strategies.",
//         category: "skill-development",
//         type: "article",
//         estimatedDuration: "30 minutes",
//         priority: "high",
//         tags: ["best-practices", "guide"],
//         url: "#"
//       }
//     ]
//   };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (activeTab !== 'ai-insights') return null;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Performance Insights</h2>
              <p className="text-gray-600">Comprehensive analysis and recommendations for your KPIs</p>
            </div>
          </div>
          {insightsLoading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          )}
        </div>
      </div>

      {aiInsights ? (
        <div className="space-y-6">
          
          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Confidence Score</span>
              </div>
              <div className="mt-2">
                <span className={`text-2xl font-bold ${getConfidenceColor(aiInsights?.performanceAnalysis?.confidenceScore)}`}>
                  {Math.round(aiInsights?.performanceAnalysis?.confidenceScore * 100)}%
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Completion Probability</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-red-600">
                  {aiInsights?.performanceAnalysis?.completionProbability}%
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Predicted Completion</span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-semibold text-gray-900">
                  {formatDate(aiInsights?.performanceAnalysis?.predictedCompletion)}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-600">Risk Level</span>
              </div>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(aiInsights?.performanceAnalysis?.riskLevel)}`}>
                  {aiInsights?.performanceAnalysis?.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Analysis Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('performance')}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Performance Analysis</h3>
              </div>
              {expandedSections.performance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            
            {expandedSections.performance && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Current Situation</h4>
                      <p className="text-blue-800">{aiInsights.performanceAnalysis.analysis}</p>
                    </div>
                  </div>
                </div>

                {aiInsights.performanceAnalysis.insights && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiInsights.performanceAnalysis.insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-yellow-800 text-sm font-medium">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Items Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('actions')}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Immediate Actions Required</h3>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  {aiInsights.improvementSuggestions.length} Action{aiInsights.improvementSuggestions.length !== 1 ? 's' : ''}
                </span>
              </div>
              {expandedSections.actions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            
            {expandedSections.actions && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="space-y-4">
                  {aiInsights.improvementSuggestions.map((action, idx) => (
                    <div key={idx} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-orange-900">{action.action}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                            {action.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                      <p className="text-orange-800 mb-2">{action.impact}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-700">Timeline: {action.timeline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resource Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('resources')}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recommended Resources</h3>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {aiInsights.resourceRecommendations.length} Resource{aiInsights.resourceRecommendations.length !== 1 ? 's' : ''}
                </span>
              </div>
              {expandedSections.resources ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            
            {expandedSections.resources && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="space-y-4">
                  {aiInsights.resourceRecommendations.map((resource, idx) => (
                    <div key={idx} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-2">{resource.title}</h4>
                          <p className="text-green-800 text-sm mb-3">{resource.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(resource.priority)} ml-4`}>
                          {resource.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="text-green-700">{resource.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-green-700 font-medium">{resource.category.replace('-', ' ')}</span>
                          </div>
                        </div>
                        
                        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          View Resource
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {resource.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Brain className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No AI Insights Available</h3>
          <p className="text-gray-600 max-w-md mx-auto">AI insights will appear here once you have KPI data to analyze. Our system will automatically generate personalized recommendations and performance predictions.</p>
        </div>
      )}
    </div>
  );
};

export default AIInsightsDashboard;