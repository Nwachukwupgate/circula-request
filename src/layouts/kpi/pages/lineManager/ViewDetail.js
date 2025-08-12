import React, { useState, useEffect } from 'react';
import { Edit3, Target, TrendingUp, BookOpen, Play, Award, AlertCircle, CheckCircle, FileText, Calendar, Activity, BarChart3, Plus } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Link, useParams } from 'react-router-dom';
import { useGetKpiDetailsQuery } from 'api/apiSlice';


const ManagerKPIDetailsView = () => {
  const { kpiId, userId } = useParams();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: kpiData, isLoading: loading } = useGetKpiDetailsQuery({ userId, kpiAssignmentId: kpiId });

  const [formData, setFormData] = useState({
    targetValue: '',
    priorityLevel: '',
    description: ''
  });

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/kpi/assignment/${kpiData.assignment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowUpdateModal(false);
        // fetchKpiDetails(); // Refresh data
      }
    } catch (err) {
      console.error('Error updating KPI:', err);
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
                Update KPI
              </button>
              <Link to={`/team/viewTeam/${kpiId}/feedback/${userId}`}>
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
                    <span className="font-semibold text-gray-900">{kpiData.currentValue}</span>
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
                        strokeDasharray={`${kpiData.progress * 3.14159} 314.159`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getProgressColor(kpiData.progress)}`}>
                          {kpiData.progress.toFixed(1)}%
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
                      <span className="font-semibold text-gray-900">{kpiData.currentValue}</span>
                      <span className="text-green-600 text-sm">+{kpiData.trend}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Target</span>
                    <span className="font-semibold text-gray-900">{kpiData.assignment.targetValue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Gap</span>
                    <span className="font-semibold text-red-600">-{(kpiData.assignment.targetValue - kpiData.currentValue).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">View Performance History</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Set Milestone</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
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
                    onClick={() => setShowSubmitReportModal(true)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update KPI Assignment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                  <input
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({...formData, targetValue: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <select
                    value={formData.priorityLevel}
                    onChange={(e) => setFormData({...formData, priorityLevel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update KPI
                </button>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default ManagerKPIDetailsView;