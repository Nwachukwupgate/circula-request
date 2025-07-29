import React, { useState } from 'react';
import { Edit3, Target, TrendingUp, BookOpen, Play, Award, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Link } from 'react-router-dom';



const KPIDetailsView = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Mock data based on your database structure
  const kpiData = {
    template: {
      title: "Code Quality and Technical Excellence",
      description: "Measures the overall quality of code deliverables, including code review scores, bug density, and adherence to coding standards. This KPI focuses on technical proficiency and best practices implementation.",
      departmentId: 1,
      metricType: "score",
      createdBy: 1
    },
    assignment: {
      staffId: 1,
      targetValue: 85.0,
      assignedAt: "2024-01-15",
      priorityLevel: "high",
      description: "Focus on improving code review feedback and reducing technical debt in current projects."
    },
    currentValue: 78.5,
    progress: 92.35, // (78.5/85.0) * 100
    trend: "+5.2",
    lastUpdated: "2024-07-10"
  };

  const [formData, setFormData] = useState({
    targetValue: kpiData.assignment.targetValue,
    priorityLevel: kpiData.assignment.priorityLevel,
    description: kpiData.assignment.description
  });

  const recommendations = [
    {
      category: "Technical Skills",
      icon: <Edit3 className="w-5 h-5" />,
      title: "Advanced Code Review Techniques",
      description: "Enhance your code review skills by learning advanced techniques for identifying potential issues and suggesting improvements. Focus on security vulnerabilities and performance optimization.",
      type: "Course",
      priority: "High"
    },
    {
      category: "Best Practices",
      icon: <BookOpen className="w-5 h-5" />,
      title: "Clean Code Principles",
      description: "Master the principles of writing clean, maintainable code. Learn about SOLID principles, design patterns, and refactoring techniques.",
      type: "Article",
      priority: "Medium"
    },
    {
      category: "Tools & Automation",
      icon: <Play className="w-5 h-5" />,
      title: "Automated Testing Strategies",
      description: "Implement comprehensive testing strategies including unit testing, integration testing, and test-driven development practices.",
      type: "Video",
      priority: "High"
    }
  ];

  const handleUpdate = () => {
    // Handle KPI update logic here
    console.log("Updating KPI with:", formData);
    setShowUpdateModal(false);
    // You would typically make an API call here
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
                    <p className="text-gray-600 mt-1">Last updated: {kpiData.lastUpdated}</p>
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
                    <Link to={"/kpi/feedback"}>
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
                        <span className="font-semibold text-gray-900">{kpiData.assignment.assignedAt}</span>
                    </div>
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

            {/* Recommendations Section */}
            {showRecommendations && (
                <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                    <h2 className="text-lg font-semibold text-gray-900">AI-Generated Recommendations</h2>
                    <p className="text-gray-600 text-sm">Based on your current performance and goals</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            {rec.icon}
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">{rec.category}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority.toLowerCase())}`}>
                            {rec.priority} Priority
                            </div>
                        </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{rec.title}</h3>
                        <p className="text-gray-700 text-sm mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{rec.type}</span>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Start Learning →
                        </button>
                        </div>
                    </div>
                    ))}
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

export default KPIDetailsView