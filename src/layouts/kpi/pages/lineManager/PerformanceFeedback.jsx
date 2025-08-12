import React, { useState, useEffect } from 'react';
import { 
  User, MessageSquare, Code, BookOpen, Play, GraduationCap, TrendingUp, TrendingDown, 
  Calendar, CheckCircle, Target, Award, Brain, Zap, Users, Home, BarChart3, 
  AlertTriangle, Clock, Star, ExternalLink, RefreshCw, Activity, Lightbulb,
  FileText, Eye, ThumbsUp, TrendingDown as TrendingDownIcon
} from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useGetKpiDetailsQuery, useGetAIInsightsQuery, useGetRecommendationsQuery, useGetDailyReminderQuery, useTrackResourceUsageMutation } from 'api/apiSlice'; // Adjust path as needed
import { Link, useParams } from 'react-router-dom';
import AIInsightsDashboard from './AIInsights';


ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const PerformanceFeedback = () => {
  const { kpiId, userId } = useParams();
  console.log('KPI ID:', kpiId, 'User ID:', userId);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: kpiData, isLoading: kpiLoading, error: kpiError, refetch: refetchKPI } = useGetKpiDetailsQuery({userId, kpiAssignmentId: kpiId});

  const { 
    data: aiInsightsData = [], 
    isLoading: insightsLoading,
    error: insightsError,
    refetch: refetchInsights 
  } = useGetAIInsightsQuery({
    userId, kpiAssignmentId: kpiId
  });

  console.log('AI Insights Data:', aiInsightsData);

  const { 
    data: recommendationsData = [], 
    isLoading: recommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations 
  } = useGetRecommendationsQuery({ limit: 8 });

  const { 
    data: dailyReminderData, 
    isLoading: reminderLoading,
    error: reminderError,
    refetch: refetchReminder 
  } = useGetDailyReminderQuery();

  const [trackResourceUsage] = useTrackResourceUsageMutation();

  // Derived state from RTK Query data
  const performanceData = kpiData?.summary;
  const kpiAssignments = kpiData?.kpis || [];
  const aiInsights = aiInsightsData || [];
  const recommendations = recommendationsData?.recommendations || [];
  const dailyReminder = dailyReminderData?.reminder || '';

  // Loading state - true if any critical data is loading
  const loading = kpiLoading || insightsLoading || recommendationsLoading || reminderLoading;

  // Error handling
  const hasError = kpiError || insightsError || recommendationsError || reminderError;

  // Refresh all data
  const handleRefreshAll = () => {
    refetchKPI();
    refetchInsights();
    refetchRecommendations();
    refetchReminder();
  };

  const handleTrackResourceUsage = async (resourceId, rating = null) => {
    try {
      await trackResourceUsage({ resourceId, rating }).unwrap();
    } catch (error) {
      console.error('Error tracking resource usage:', error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course': return <GraduationCap className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'article': return <BookOpen className="w-4 h-4" />;
      case 'tool': return <Zap className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // Chart data for overall performance
  const overallRating = performanceData?.avgProgress || 65;
  const filled = (overallRating / 100) * 180;
  const empty = 180 - filled;

  const doughnutData = {
    labels: ['Progress', 'Remaining'],
    datasets: [
      {
        data: [filled, empty],
        backgroundColor: ['#1d4ed8', '#f3f4f6'],
        borderWidth: 0,
        cutout: '75%',
        circumference: 180,
        rotation: -90,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  // Performance trend chart data
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Performance Score',
        data: [58, 62, 67, 65, 69, overallRating],
        borderColor: '#1d4ed8',
        backgroundColor: 'rgba(29, 78, 216, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Error state
  // if (hasError && !loading) {
  //   return (
  //     <DashboardLayout>
  //       <DashboardNavbar />
  //       <div className="min-h-screen p-8 flex items-center justify-center">
  //         <div className="text-center">
  //           <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
  //           <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
  //           <p className="text-gray-600 mb-4">There was an issue loading your performance data.</p>
  //           <button
  //             onClick={handleRefreshAll}
  //             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
  //           >
  //             Try Again
  //           </button>
  //         </div>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  // Loading state
  if (loading && !kpiData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your performance insights...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Performance Insights</h1>
                <p className="text-gray-600">AI-powered performance analysis and recommendations</p>
              </div>
            </div>
            <button
              onClick={handleRefreshAll}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Daily AI Reminder */}
          {dailyReminder && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Today's AI Insight</h3>
                  <p className="text-purple-800 leading-relaxed">{dailyReminder}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Employee Profile Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                        alt="Alex Uwoke" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Alex Uwoke</h2>
                      <p className="text-gray-600 text-base p-1 bg-[#F4F4F4] rounded-xl">Software Engineer</p>
                      <p className="text-sm text-gray-500">Joined 2 years ago</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl flex items-center space-x-3 min-w-[290px]">
                    <Award className="w-12 h-12" />
                    <div className="text-sm">
                      <div className="font-bold text-center text-lg">Top Performer</div>
                      <div className="text-xs opacity-90 text-center">
                        {overallRating >= 80 ? "Outstanding performance!" : "Great progress this quarter!"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview', icon: BarChart3 },
                      { id: 'ai-insights', label: 'AI Insights', icon: Brain },
                      { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                      { id: 'resources', label: 'Learning', icon: BookOpen }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* KPI Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Target className="w-8 h-8 text-blue-500" />
                            <div>
                              <p className="text-sm text-blue-600 font-medium">Total KPIs</p>
                              <p className="text-2xl font-bold text-blue-900">{performanceData?.totalKpis || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div>
                              <p className="text-sm text-green-600 font-medium">Completed</p>
                              <p className="text-2xl font-bold text-green-900">{performanceData?.completedKpis || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-orange-500" />
                            <div>
                              <p className="text-sm text-orange-600 font-medium">In Progress</p>
                              <p className="text-2xl font-bold text-orange-900">{performanceData?.inProgressKpis || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Trend */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
                        <div className="h-64">
                          <Line data={trendData} options={trendOptions} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Insights Tab */}
                  {activeTab === 'ai-insights' && (
                    // <div className="space-y-6">
                    //   <div className="flex items-center gap-2 mb-4">
                    //     <Brain className="w-5 h-5 text-purple-600" />
                    //     <h3 className="text-lg font-semibold text-gray-900">AI-Generated Performance Insights</h3>
                    //     {insightsLoading && (
                    //       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    //     )}
                    //   </div>

                    //   {aiInsights ? (
                    //     <div className="space-y-6">
                          
                    //       <div className="border border-gray-200 rounded-xl p-6">
                    //         <div className="flex items-center justify-between mb-4">
                    //           <h4 className="text-lg font-semibold text-gray-900">{aiInsights?.insights?.insightType}</h4>
                    //           {aiInsights?.insights?.riskLevel && (
                    //             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(aiInsights.insights.riskLevel)}`}>
                    //               {aiInsights.insights.riskLevel.toUpperCase()} RISK
                    //             </span>
                    //           )}
                    //         </div>

                    //         {aiInsights?.performanceAnalysis && (
                    //           <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    //             <p className="text-gray-700 leading-relaxed">{aiInsights?.performanceAnalysis?.analysis}</p>
                    //           </div>
                    //         )}

                    //         {aiInsights?.performanceAnalysis?.insights && (
                    //           <div className="mb-4">
                    //             <h5 className="font-medium text-gray-900 mb-2">Key Insights:</h5>
                    //             <ul className="space-y-2">
                    //               {aiInsights?.performanceAnalysis?.insights.map((item, idx) => (
                    //                 <li key={idx} className="flex items-start gap-2">
                    //                   <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    //                   <span className="text-gray-700 text-sm">{item}</span>
                    //                 </li>
                    //               ))}
                    //             </ul>
                    //           </div>
                    //         )}

                    //         {aiInsights?.improvementSuggestions && aiInsights.improvementSuggestions.length > 0 && (
                    //           <div>
                    //             <h5 className="font-medium text-gray-900 mb-3">Recommended Actions:</h5>
                    //             <div className="space-y-3">
                    //               {aiInsights?.improvementSuggestions?.map((action, actionIdx) => (
                    //                 <div key={actionIdx} className="bg-blue-50 rounded-lg p-3">
                    //                   <div className="flex items-center justify-between mb-2">
                    //                     <span className="font-medium text-blue-900">{action?.action}</span>
                    //                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action?.priority)}`}>
                    //                       {action?.priority}
                    //                     </span>
                    //                   </div>
                    //                   <p className="text-blue-800 text-sm mb-1">{action?.impact}</p>
                    //                   <p className="text-blue-600 text-xs">Timeline: {action?.timeline}</p>
                    //                 </div>
                    //               ))}
                    //             </div>
                    //           </div>
                    //         )}
                    //       </div>
                          
                    //     </div>
                    //   ) : (
                    //     <div className="text-center py-8">
                    //       <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    //       <h4 className="text-lg font-medium text-gray-900 mb-2">No AI Insights Available</h4>
                    //       <p className="text-gray-600">AI insights will appear here once you have KPI data to analyze</p>
                    //     </div>
                    //   )}
                    // </div>
                    <AIInsightsDashboard aiInsights={aiInsightsData} />
                  )}

                  {/* Feedback Tab */}
                  {activeTab === 'feedback' && (
                    <div className="space-y-6">
                      {/* Manager Comments */}
                      <div className="bg-green-50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">Manager Feedback</h3>
                        </div>

                        <div className="bg-white rounded-xl p-5">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">Sarah</span>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  2 weeks ago
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                "I've noticed a significant improvement in your project management skills. Keep up the great work! However, let's work on refining your presentation style to make it more engaging."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* System Generated Feedback */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">System Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Code className="w-6 h-6 text-purple-500" />
                              <span className="font-medium text-gray-900">Technical Proficiency</span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Strong technical skills demonstrated across projects. Consider exploring advanced frameworks to enhance productivity.
                            </p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <MessageSquare className="w-6 h-6 text-blue-500" />
                              <span className="font-medium text-gray-900">Communication</span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Good collaboration in team settings. Focus on presentation skills and documentation clarity.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Learning Resources Tab */}
                  {activeTab === 'resources' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-gray-900">AI-Curated Learning Resources</h3>
                          {recommendationsLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{recommendations.length} recommendations</span>
                      </div>

                      {recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {recommendations.map((resource) => (
                            <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="bg-blue-100 p-2 rounded-lg">
                                    {getTypeIcon(resource.type)}
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(resource.priority)}`}>
                                    {resource.priority} priority
                                  </span>
                                </div>
                                {resource.aiGenerated && (
                                  <div className="bg-purple-100 px-2 py-1 rounded-full">
                                    <span className="text-xs font-medium text-purple-700">AI Generated</span>
                                  </div>
                                )}
                              </div>

                              <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                              <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <span className="capitalize">{resource.type}</span>
                                {resource.estimatedDuration && (
                                  <span>{resource.estimatedDuration}</span>
                                )}
                              </div>

                              {resource.tags && resource.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <span key={tagIndex} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {resource.avgRating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                      <span className="text-sm text-gray-600">{resource.avgRating.toFixed(1)}</span>
                                    </div>
                                  )}
                                  {resource.usageCount > 0 && (
                                    <span className="text-xs text-gray-500">Used {resource.usageCount} times</span>
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => {
                                    handleTrackResourceUsage(resource.id);
                                    window.open(resource.url, '_blank');
                                  }}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  Start Learning
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h4>
                          <p className="text-gray-600">AI recommendations will appear here based on your performance data</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Performance Summary Circle */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Summary</h3>
                
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-64 h-64">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                    <div className="absolute inset-0 top-16 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{overallRating}%</span>
                      <span className="text-sm text-gray-600">Overall Rating</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">KPIs Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{performanceData?.completedKpis || 0}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-green-500">
                      <span className="text-sm font-medium">+15%</span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Avg Progress</p>
                      <p className="text-2xl font-bold text-gray-900">{performanceData?.avgProgress || 0}%</p>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-500">
                      <span className="text-sm font-medium">+8%</span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Risk Assessment */}
              {aiInsights.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                  <div className="space-y-3">
                    {aiInsights.slice(0, 3).map((insight, index) => {
                      const riskLevel = insight.insights?.riskLevel || 'medium';
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className={`w-4 h-4 ${
                              riskLevel === 'critical' ? 'text-red-500' :
                              riskLevel === 'high' ? 'text-orange-500' :
                              riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{insight.kpiTitle}</p>
                              <p className="text-xs text-gray-500">
                                {insight.performanceAnalysis?.completionProbability 
                                  ? `${insight.performanceAnalysis.completionProbability}% completion probability`
                                  : 'Analyzing...'
                                }
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(riskLevel)}`}>
                            {riskLevel.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Submit KPI Report</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">View All KPIs</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Browse Learning Resources</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Request Feedback</span>
                  </button>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {kpiAssignments.filter(kpi => kpi.progress >= 100).slice(0, 3).map((kpi, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">{kpi.name}</span>
                    </div>
                  ))}
                  {kpiAssignments.filter(kpi => kpi.progress >= 100).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No completed KPIs yet. Keep working towards your goals!</p>
                  )}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Reports Submitted</p>
                      <p className="text-lg font-bold text-blue-900">
                        {kpiAssignments.reduce((total, kpi) => total + (kpi.reports?.length || 0), 0)}
                      </p>
                    </div>
                    <div className="flex items-center text-sm font-medium text-blue-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-900">Goals Achieved</p>
                      <p className="text-lg font-bold text-green-900">{performanceData?.completedKpis || 0}</p>
                    </div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +25%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-purple-900">Learning Hours</p>
                      <p className="text-lg font-bold text-purple-900">
                        {recommendations.filter(r => r.usageCount > 0).length * 2}h
                      </p>
                    </div>
                    <div className="flex items-center text-sm font-medium text-purple-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +18%
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Prediction Summary */}
              {aiInsights.length > 0 && (
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">AI Prediction</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/90">Expected Goal Completion</span>
                      <span className="font-bold">
                        {Math.round(aiInsights.reduce((avg, insight) => 
                          avg + (insight.performanceAnalysis?.completionProbability || 0), 0
                        ) / aiInsights.length)}%
                      </span>
                    </div>
                    <div className="text-sm text-white/80">
                      Based on current performance trends and AI analysis
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default PerformanceFeedback;