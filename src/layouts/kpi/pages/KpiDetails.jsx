import React, { useState, useEffect } from 'react';
import { Edit3, Target, TrendingUp, BookOpen, Play, Award, AlertCircle, CheckCircle, FileText, Calendar, Activity, BarChart3, Plus, X, MessageSquare, Flag, History } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Link, useParams } from 'react-router-dom';
import { useGetMyKpiDetailsQuery, useSetMilestoneMutation, useRequestKpiFeedbackMutation, useGetPerformanceHistoryQuery } from 'api/apiSlice';
import CreateKpiReportForm from '../components/ReportKpi';
import { toast } from 'react-toastify';



const KPIDetailsView = () => {
    const { id } = useParams();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Quick Actions Modal States
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    
    // Form States
    const [milestoneData, setMilestoneData] = useState({
      milestoneValue: '',
      milestoneNote: '',
      milestoneDate: ''
    });
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const { data: kpiData, isLoading: loading } = useGetMyKpiDetailsQuery({ kpiAssignmentId: id });
    const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useGetPerformanceHistoryQuery(id, { skip: !showHistoryModal });
    
    const [setMilestone, { isLoading: milestoneLoading }] = useSetMilestoneMutation();
    const [requestFeedback, { isLoading: feedbackLoading }] = useRequestKpiFeedbackMutation();

    const [formData, setFormData] = useState({
      targetValue: '',
      priorityLevel: '',
      description: ''
    });
    
    // Handle Milestone Submit
    const handleMilestoneSubmit = async (e) => {
      e.preventDefault();
      try {
        await setMilestone({
          kpiAssignmentId: id,
          ...milestoneData
        }).unwrap();
        toast.success('Milestone set successfully!');
        setShowMilestoneModal(false);
        setMilestoneData({ milestoneValue: '', milestoneNote: '', milestoneDate: '' });
      } catch (error) {
        toast.error(error.data?.message || 'Failed to set milestone');
      }
    };
    
    // Handle Feedback Request Submit
    const handleFeedbackSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await requestFeedback({
          kpiAssignmentId: id,
          message: feedbackMessage
        }).unwrap();
        toast.success(`Feedback request sent to ${response.data?.manager || 'your manager'}!`);
        setShowFeedbackModal(false);
        setFeedbackMessage('');
      } catch (error) {
        toast.error(error.data?.message || 'Failed to request feedback');
      }
    };
  
    const getPriorityColor = (priority) => {
      switch(priority) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
  
    const getProgressColor = (progress) => {
      if (progress >= 90) return 'text-green-600';
      if (progress >= 70) return 'text-blue-600';
      if (progress >= 50) return 'text-yellow-600';
      return 'text-red-600';
    };
  
    const getPeriodColor = (period) => {
      switch(period) {
        case 'weekly': return 'bg-blue-100 text-blue-800';
        case 'monthly': return 'bg-green-100 text-green-800';
        case 'quarterly': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
  
    if (loading) {
      return (
        <DashboardLayout>
          <DashboardNavbar />
          <div className="min-h-screen p-3 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading KPI details...</p>
            </div>
          </div>
        </DashboardLayout>
      );
    }

  return (
    <DashboardLayout>
          <DashboardNavbar />
          <MDBox mb={2} />
          <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{kpiData.template.title}</h1>
                    <p className="text-gray-600 mt-1">Last updated: {formatDate(kpiData.lastUpdated)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpdateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Submit Report
                  </button>
                  <Link to={`/kpi/feedback/${id}`}>
                    <button
                      onClick={() => setShowRecommendations(!showRecommendations)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      {showRecommendations ? 'Hide' : 'Show'} Recommendations
                    </button>
                  </Link>
                </div>
              </div>
            </div>
    
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Overview
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reports'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Reports ({kpiData.reports.length})
                    </div>
                  </button>
                </nav>
              </div>
            </div>
    
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KPI Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{kpiData.template.description}</p>
                  </div>
    
                  {/* Assignment Details */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Target Value:</span>
                        <span className="font-semibold text-gray-900">{kpiData.assignment.targetValue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Current Value:</span>
                        <span className="font-semibold text-gray-900">{kpiData.totalValue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Priority Level:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(kpiData.assignment.priorityLevel)}`}>
                          {kpiData.assignment.priorityLevel.charAt(0).toUpperCase() + kpiData.assignment.priorityLevel.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Assigned Date:</span>
                        <span className="font-semibold text-gray-900">{formatDate(kpiData.assignment.assignedAt)}</span>
                      </div>
                      {kpiData.assignment.dueDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-semibold text-gray-900">{formatDate(kpiData.assignment.dueDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    {kpiData.assignment.description && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Assignment Notes:</h3>
                        <p className="text-gray-700">{kpiData.assignment.description}</p>
                      </div>
                    )}
                  </div>
                </div>
    
                {/* Performance Summary */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
                    
                    {/* Progress Circle */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeDasharray={`${kpiData?.progress * 3.14159} 314.159`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getProgressColor(kpiData?.progress)}`}>
                              {kpiData?.progress?.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">Progress</div>
                          </div>
                        </div>
                      </div>
                    </div>
    
                    {/* Metrics */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Current Score</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{kpiData.totalValue}</span>
                          <span className="text-green-600 text-sm">+{kpiData.trend}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Target</span>
                        <span className="font-semibold text-gray-900">{kpiData.assignment.targetValue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Gap</span>
                        <span className="font-semibold text-red-600">-{(kpiData.assignment.targetValue - kpiData.totalValue).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
    
                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowHistoryModal(true)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                      >
                        <History className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">View Performance History</span>
                      </button>
                      <button 
                        onClick={() => setShowMilestoneModal(true)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                      >
                        <Flag className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Set Milestone</span>
                      </button>
                      <button 
                        onClick={() => setShowFeedbackModal(true)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200"
                      >
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                        <span className="text-gray-700">Request Feedback</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
    
            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                {/* Reports Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Total Reports</p>
                        <p className="text-2xl font-bold text-gray-900">{kpiData.reports.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Activity className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Latest Value</p>
                        <p className="text-2xl font-bold text-gray-900">{kpiData.currentValue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">Avg Value</p>
                        <p className="text-2xl font-bold text-gray-900">{kpiData.avgValue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-8 h-8 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">Best Value</p>
                        <p className="text-2xl font-bold text-gray-900">{kpiData.bestValue}</p>
                      </div>
                    </div>
                  </div>
                </div>
    
                {/* Reports List */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Report History</h2>
                        <p className="text-gray-600 text-sm">All reports submitted for this KPI</p>
                      </div>
                      <button
                        onClick={() => setShowUpdateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Submit Report
                      </button>
                    </div>
                  </div>
                  
                  {kpiData.reports.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No reports submitted yet</p>
                      <p className="text-gray-400 text-sm">Reports will appear here once submitted</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {kpiData.reports.map((report, index) => (
                        <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-blue-100 p-3 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {report.period.charAt(0).toUpperCase() + report.period.slice(1)} Report
                                  </h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPeriodColor(report.period)}`}>
                                    {report.period}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Submitted: {formatDate(report.reportDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Activity className="w-4 h-4" />
                                    <span>Value: {report.actualValue}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">{report.actualValue}</div>
                              <div className="text-sm text-gray-500">
                                {((report.actualValue / kpiData.assignment.targetValue) * 100).toFixed(1)}% of target
                              </div>
                            </div>
                          </div>
                          
                          {report.notes && (
                            <div className="mt-4 ml-16">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-700">{report.notes}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 ml-16">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (report.actualValue / kpiData.assignment.targetValue) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
    
            {/* Update Modal */}
            {showUpdateModal && (
              <CreateKpiReportForm kpiAssignmentId={id} setShowCreateModal={setShowUpdateModal} />
            )}
            
            {/* Performance History Modal */}
            {showHistoryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <History className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Performance History</h2>
                    </div>
                    <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {historyLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading history...</span>
                      </div>
                    ) : historyData ? (
                      <div className="space-y-6">
                        {/* Statistics Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">{historyData.statistics?.totalReports || 0}</p>
                            <p className="text-sm text-gray-600">Total Reports</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">{historyData.statistics?.avgValue || 0}</p>
                            <p className="text-sm text-gray-600">Average Value</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">{historyData.statistics?.maxValue || 0}</p>
                            <p className="text-sm text-gray-600">Best Value</p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-4 text-center">
                            <p className={`text-2xl font-bold ${historyData.statistics?.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {historyData.statistics?.trend >= 0 ? '+' : ''}{historyData.statistics?.trend || 0}
                            </p>
                            <p className="text-sm text-gray-600">Trend</p>
                          </div>
                        </div>
                        
                        {/* Reports Timeline */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Timeline</h3>
                          {historyData.reports?.length > 0 ? (
                            <div className="space-y-3">
                              {historyData.reports.map((report, index) => (
                                <div key={report.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-gray-900 capitalize">{report.period} Report</span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(report.reportDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="text-gray-600">Value: <strong className="text-gray-900">{report.actualValue}</strong></span>
                                      {report.notes && <span className="text-gray-500">• {report.notes}</span>}
                                    </div>
                                    {report.feedback && (
                                      <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-sm text-gray-600">
                                        {report.feedback.managerComment || report.feedback.systemFeedback}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>No reports submitted yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Unable to load performance history</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Set Milestone Modal */}
            {showMilestoneModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Flag className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Set Milestone</h2>
                    </div>
                    <button onClick={() => setShowMilestoneModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleMilestoneSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Milestone Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={milestoneData.milestoneValue}
                        onChange={(e) => setMilestoneData({ ...milestoneData, milestoneValue: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        placeholder={`Target: ${kpiData?.assignment?.targetValue || 0}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Date
                      </label>
                      <input
                        type="date"
                        value={milestoneData.milestoneDate}
                        onChange={(e) => setMilestoneData({ ...milestoneData, milestoneDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note (Optional)
                      </label>
                      <textarea
                        value={milestoneData.milestoneNote}
                        onChange={(e) => setMilestoneData({ ...milestoneData, milestoneNote: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                        placeholder="Describe this milestone..."
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowMilestoneModal(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={milestoneLoading}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {milestoneLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Setting...
                          </>
                        ) : (
                          <>
                            <Flag className="w-4 h-4" />
                            Set Milestone
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Request Feedback Modal */}
            {showFeedbackModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Request Feedback</h2>
                    </div>
                    <button onClick={() => setShowFeedbackModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleFeedbackSubmit} className="p-6 space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm text-orange-800">
                        Your feedback request will be sent to your manager who assigned this KPI. They will be notified to review your progress.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        KPI
                      </label>
                      <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                        {kpiData?.template?.title || 'Loading...'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message to Manager
                      </label>
                      <textarea
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                        placeholder="Describe what feedback you're looking for, any challenges you're facing, or questions you have..."
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowFeedbackModal(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={feedbackLoading}
                        className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {feedbackLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4" />
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          <Footer />
    </DashboardLayout>
  );
};

export default KPIDetailsView