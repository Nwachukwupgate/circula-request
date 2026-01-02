import React, { useState, useEffect } from 'react';
import { 
  User, MessageSquare, Code, BookOpen, Play, GraduationCap, TrendingUp, TrendingDown, 
  Calendar, CheckCircle, Target, Award, Brain, Zap, Users, Home, BarChart3, 
  AlertTriangle, Clock, Star, ExternalLink, RefreshCw, Activity, Lightbulb,
  FileText, Eye, ThumbsUp, TrendingDown as TrendingDownIcon, X
} from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useGetKpiDetailsQuery, useGetAIInsightsQuery, useGetRecommendationsQuery, useGetDailyReminderQuery, useTrackResourceUsageMutation, useGetKpiFeedbackHistoryQuery, useReplyToFeedbackRequestMutation } from 'api/apiSlice'; // Adjust path as needed
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

  const {
    data: feedbackHistoryData,
    isLoading: feedbackLoading,
    refetch: refetchFeedbackHistory
  } = useGetKpiFeedbackHistoryQuery(kpiId);

  const [trackResourceUsage] = useTrackResourceUsageMutation();
  const [replyToRequest, { isLoading: replyLoading }] = useReplyToFeedbackRequestMutation();
  
  // State for reply modal
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  const handleReplyToRequest = async () => {
    if (!selectedRequest || !replyText.trim()) return;
    try {
      await replyToRequest({
        feedbackId: selectedRequest.id,
        reply: replyText
      }).unwrap();
      setShowReplyModal(false);
      setReplyText('');
      setSelectedRequest(null);
      refetchFeedbackHistory();
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  // Derived state from RTK Query data
  const performanceData = kpiData?.summary;
  const kpiAssignments = kpiData?.kpis || [];
  const aiInsights = aiInsightsData || [];
  const recommendations = recommendationsData?.recommendations || [];
  const dailyReminder = dailyReminderData?.reminder || '';
  
  // Current KPI specific data
  const currentKpi = kpiData;
  const kpiReports = kpiData?.reports || [];
  const kpiProgress = kpiData?.progress || 0;
  const kpiTargetValue = kpiData?.assignment?.targetValue || 0;
  const kpiCurrentValue = kpiData?.totalValue || 0;

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

  // Performance trend chart data - using actual reports
  const getChartDataFromReports = () => {
    if (!kpiReports || kpiReports.length === 0) {
      return {
        labels: ['No Data'],
        data: [0]
      };
    }
    
    // Sort reports by date and take last 6
    const sortedReports = [...kpiReports]
      .sort((a, b) => new Date(a.reportDate) - new Date(b.reportDate))
      .slice(-6);
    
    const labels = sortedReports.map(report => {
      const date = new Date(report.reportDate);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const data = sortedReports.map(report => {
      return kpiTargetValue > 0 ? Math.round((report.actualValue / kpiTargetValue) * 100) : 0;
    });
    
    return { labels, data };
  };
  
  const chartData = getChartDataFromReports();
  
  const trendData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Progress %',
        data: chartData.data,
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
                  {/* <div className="flex items-center space-x-4">
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
                  </div> */}
                  {/* <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl flex items-center space-x-3 min-w-[290px]">
                    <Award className="w-12 h-12" />
                    <div className="text-sm">
                      <div className="font-bold text-center text-lg">Top Performer</div>
                      <div className="text-xs opacity-90 text-center">
                        {overallRating >= 80 ? "Outstanding performance!" : "Great progress this quarter!"}
                      </div>
                    </div>
                  </div> */}
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
                      {/* KPI Header Info */}
                      {currentKpi && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{currentKpi.template?.title || 'KPI Details'}</h3>
                              <p className="text-gray-600 mt-1">{currentKpi.template?.description || ''}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              kpiProgress >= 100 ? 'bg-green-100 text-green-700' :
                              kpiProgress >= 50 ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {kpiProgress >= 100 ? 'Completed' : kpiProgress >= 50 ? 'On Track' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* KPI Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Target className="w-8 h-8 text-blue-500" />
                            <div>
                              <p className="text-sm text-blue-600 font-medium">Target Value</p>
                              <p className="text-2xl font-bold text-blue-900">{kpiTargetValue}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div>
                              <p className="text-sm text-green-600 font-medium">Current Value</p>
                              <p className="text-2xl font-bold text-green-900">{kpiCurrentValue}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-purple-500" />
                            <div>
                              <p className="text-sm text-purple-600 font-medium">Progress</p>
                              <p className="text-2xl font-bold text-purple-900">{kpiProgress.toFixed(1)}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-orange-500" />
                            <div>
                              <p className="text-sm text-orange-600 font-medium">Reports</p>
                              <p className="text-2xl font-bold text-orange-900">{kpiReports.length}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                          <span className="text-sm font-bold text-gray-900">{kpiCurrentValue} / {kpiTargetValue}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full transition-all duration-500 ${
                              kpiProgress >= 100 ? 'bg-green-500' :
                              kpiProgress >= 70 ? 'bg-blue-500' :
                              kpiProgress >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(kpiProgress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Performance Trend */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
                          <span className="text-sm text-gray-500">Based on {kpiReports.length} report(s)</span>
                        </div>
                        {kpiReports.length > 0 ? (
                          <div className="h-64">
                            <Line data={trendData} options={trendOptions} />
                          </div>
                        ) : (
                          <div className="h-64 flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500">No reports submitted yet</p>
                              <p className="text-sm text-gray-400 mt-1">Reports will show performance trend here</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Recent Reports Summary */}
                      {kpiReports.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200">
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {kpiReports.slice(0, 3).map((report, idx) => (
                              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    idx === 0 ? 'bg-blue-100' : 'bg-gray-100'
                                  }`}>
                                    <FileText className={`w-5 h-5 ${idx === 0 ? 'text-blue-600' : 'text-gray-600'}`} />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 capitalize">{report.period} Report</p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(report.reportDate).toLocaleDateString('en-US', { 
                                        month: 'short', day: 'numeric', year: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">{report.actualValue}</p>
                                  <p className={`text-sm ${
                                    kpiTargetValue > 0 && (report.actualValue / kpiTargetValue) >= 0.5 
                                      ? 'text-green-600' : 'text-gray-500'
                                  }`}>
                                    {kpiTargetValue > 0 ? `${((report.actualValue / kpiTargetValue) * 100).toFixed(0)}% of target` : ''}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Insights Tab */}
                  {activeTab === 'ai-insights' && (
                   <AIInsightsDashboard aiInsights={aiInsightsData} />
                  )}

                  {/* Feedback Tab */}
                  {activeTab === 'feedback' && (
                    <div className="space-y-6">
                      {feedbackLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                          <span className="ml-3 text-gray-600">Loading feedback...</span>
                        </div>
                      ) : (
                        <>
                          {/* Staff Feedback Requests */}
                          {feedbackHistoryData?.staffRequests?.length > 0 && (
                            <div className="bg-orange-50 rounded-xl p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                  </div>
                                  <h3 className="text-xl font-semibold text-gray-900">Feedback Requests</h3>
                                </div>
                                <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-medium">
                                  {feedbackHistoryData.staffRequests.filter(r => r.status === 'pending').length} pending
                                </span>
                              </div>

                              <div className="space-y-3">
                                {feedbackHistoryData.staffRequests.map((request, idx) => (
                                  <div key={idx} className={`bg-white rounded-xl p-5 border ${request.status === 'pending' ? 'border-orange-200' : 'border-gray-200'}`}>
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${request.status === 'pending' ? 'bg-orange-100' : 'bg-green-100'}`}>
                                          <User className={`w-5 h-5 ${request.status === 'pending' ? 'text-orange-600' : 'text-green-600'}`} />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <span className="font-medium text-gray-900">{feedbackHistoryData.kpi?.staffName || 'Staff'}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                              {request.status}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center">
                                              <Calendar className="w-3 h-3 mr-1" />
                                              {new Date(request.createdAt).toLocaleDateString()}
                                            </span>
                                          </div>
                                          <p className="text-gray-700 text-sm leading-relaxed italic">
                                            "{request.message}"
                                          </p>
                                        </div>
                                      </div>
                                      {request.status === 'pending' && (
                                        <button 
                                          onClick={() => {
                                            setSelectedRequest(request);
                                            setShowReplyModal(true);
                                          }}
                                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                                        >
                                          Reply
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Manager Comments */}
                          <div className="bg-green-50 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900">Manager Feedback</h3>
                            </div>

                            {feedbackHistoryData?.managerFeedback?.length > 0 ? (
                              <div className="space-y-3">
                                {feedbackHistoryData.managerFeedback.map((feedback, idx) => (
                                  <div key={idx} className="bg-white rounded-xl p-5">
                                    <div className="flex items-start space-x-4">
                                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <span className="font-medium text-gray-900">{feedbackHistoryData.manager?.name || 'Manager'}</span>
                                          <span className="text-xs text-gray-500 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(feedback.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                          "{feedback.comment}"
                                        </p>
                                        {feedback.recommendation && (
                                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                              <span className="font-medium">Recommendation:</span> {feedback.recommendation}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl p-8 text-center">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No manager feedback yet</p>
                                <p className="text-sm text-gray-400 mt-1">Feedback will appear here once provided</p>
                              </div>
                            )}
                          </div>

                          {/* System Generated Feedback / AI Analysis */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Brain className="w-5 h-5 text-purple-500" />
                              AI System Analysis
                            </h3>
                            {feedbackHistoryData?.systemAnalysis?.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {feedbackHistoryData.systemAnalysis.map((analysis, idx) => (
                                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                      {analysis.icon === 'trending-up' && <TrendingUp className="w-6 h-6 text-green-500" />}
                                      {analysis.icon === 'target' && <Target className="w-6 h-6 text-blue-500" />}
                                      {analysis.icon === 'alert' && <AlertTriangle className="w-6 h-6 text-orange-500" />}
                                      {!['trending-up', 'target', 'alert'].includes(analysis.icon) && <Brain className="w-6 h-6 text-purple-500" />}
                                      <span className="font-medium text-gray-900">{analysis.category}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                      {analysis.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp className="w-6 h-6 text-green-500" />
                                    <span className="font-medium text-gray-900">Performance Trend</span>
                                  </div>
                                  <p className="text-gray-600 text-sm">
                                    {kpiData?.progress >= 70 
                                      ? "Excellent progress towards target. Continue maintaining this momentum for optimal results."
                                      : kpiData?.progress >= 40
                                      ? "Good progress being made. Consider focusing on key deliverables to accelerate completion."
                                      : "Early stage progress. Set clear milestones and track regularly for better outcomes."}
                                  </p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Target className="w-6 h-6 text-blue-500" />
                                    <span className="font-medium text-gray-900">Goal Alignment</span>
                                  </div>
                                  <p className="text-gray-600 text-sm">
                                    {kpiData?.assignment?.priorityLevel === 'high'
                                      ? "High priority KPI - requires focused attention and regular check-ins."
                                      : "Aligned with departmental objectives. Regular updates recommended."}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
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
              {/* KPI Progress Circle */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Staff's KPI Progress</h3>
                
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-48 h-48">
                    <Doughnut 
                      data={{
                        labels: ['Progress', 'Remaining'],
                        datasets: [{
                          data: [Math.min(kpiProgress, 100), Math.max(100 - kpiProgress, 0)],
                          backgroundColor: [
                            kpiProgress >= 100 ? '#10b981' : kpiProgress >= 70 ? '#3b82f6' : kpiProgress >= 40 ? '#f59e0b' : '#ef4444',
                            '#f3f4f6'
                          ],
                          borderWidth: 0,
                          cutout: '75%',
                          circumference: 360,
                          rotation: -90,
                        }],
                      }} 
                      options={doughnutOptions} 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${
                        kpiProgress >= 100 ? 'text-green-600' : kpiProgress >= 70 ? 'text-blue-600' : kpiProgress >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{kpiProgress.toFixed(0)}%</span>
                      <span className="text-sm text-gray-500">Complete</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-gray-600 text-sm">Target Value</p>
                      <p className="text-xl font-bold text-blue-900">{kpiTargetValue}</p>
                    </div>
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-gray-600 text-sm">Current Value</p>
                      <p className="text-xl font-bold text-green-900">{kpiCurrentValue}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-gray-600 text-sm">Reports Submitted</p>
                      <p className="text-xl font-bold text-purple-900">{kpiReports.length}</p>
                    </div>
                    <FileText className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* AI Risk Assessment */}
              {aiInsights.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Risk Assessment</h3>
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

              {/* Pending Feedback Requests */}
              {feedbackHistoryData?.feedbackHistory?.filter(f => f.type === 'request' && f.status === 'pending').length > 0 && (
                <div className="bg-orange-50 rounded-2xl shadow-sm border border-orange-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-orange-900">Pending Requests</h3>
                  </div>
                  <div className="space-y-3">
                    {feedbackHistoryData.feedbackHistory.filter(f => f.type === 'request' && f.status === 'pending').slice(0, 2).map((request) => (
                      <div key={request.id} className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{request.message}</p>
                        <button 
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowReplyModal(true);
                          }}
                          className="text-sm text-orange-600 font-medium hover:text-orange-700"
                        >
                          Reply →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manager Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Actions</h3>
                <div className="space-y-3">
                  <Link to={`/kpi/view/${userId}/${kpiId}`}>
                    <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">View Full KPI Details</span>
                    </button>
                  </Link>
                  <button 
                    onClick={() => setActiveTab('feedback')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">View/Add Feedback</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('resources')}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Learning Resources</span>
                  </button>
                  <Link to={`/kpi/team`}>
                    <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <Users className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">Back to Team KPIs</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* KPI Details */}
              {currentKpi && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">KPI Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <span className="text-gray-500 min-w-[80px]">Title:</span>
                      <span className="text-gray-900 font-medium">{currentKpi.template?.title}</span>
                    </div>
                    {currentKpi.template?.description && (
                      <div className="flex items-start gap-3 text-sm">
                        <span className="text-gray-500 min-w-[80px]">Description:</span>
                        <span className="text-gray-700 line-clamp-3">{currentKpi.template.description}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3 text-sm">
                      <span className="text-gray-500 min-w-[80px]">Period:</span>
                      <span className="text-gray-700 capitalize">{currentKpi.assignment?.period || 'N/A'}</span>
                    </div>
                    {currentKpi.assignment?.endDate && (
                      <div className="flex items-start gap-3 text-sm">
                        <span className="text-gray-500 min-w-[80px]">Due Date:</span>
                        <span className="text-gray-700">
                          {new Date(currentKpi.assignment.endDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    {currentKpi.assignment?.status && (
                      <div className="flex items-start gap-3 text-sm">
                        <span className="text-gray-500 min-w-[80px]">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          currentKpi.assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          currentKpi.assignment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {currentKpi.assignment.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Reports */}
              {kpiReports.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
                  <div className="space-y-3">
                    {kpiReports.slice(0, 3).map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{report.period}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(report.reportDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{report.actualValue}</p>
                          <p className={`text-xs ${
                            kpiTargetValue > 0 && (report.actualValue / kpiTargetValue) >= 0.5
                              ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {kpiTargetValue > 0 ? `${((report.actualValue / kpiTargetValue) * 100).toFixed(0)}%` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Prediction Summary */}
              {aiInsights.length > 0 && (
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">AI Prediction</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/90">Completion Probability</span>
                      <span className="font-bold">
                        {Math.round(aiInsights.reduce((avg, insight) => 
                          avg + (insight.performanceAnalysis?.completionProbability || 0), 0
                        ) / aiInsights.length)}%
                      </span>
                    </div>
                    <div className="text-sm text-white/80">
                      Based on staff's current progress and AI analysis
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Reply to Feedback Request Modal */}
      {showReplyModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Reply to Request</h3>
              </div>
              <button onClick={() => setShowReplyModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Original Request */}
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-orange-800 font-medium mb-1">Staff's Request:</p>
                <p className="text-gray-700 italic">"{selectedRequest.message}"</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                  placeholder="Provide your feedback response..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplyToRequest}
                  disabled={replyLoading || !replyText.trim()}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {replyLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Reply'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </DashboardLayout>
  );
};

export default PerformanceFeedback;