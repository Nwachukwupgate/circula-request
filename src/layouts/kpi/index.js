
import React from 'react';
import { TrendingUp, Users, CheckCircle, Clock, Plus, Lightbulb, Calendar,Target } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link } from 'react-router-dom';
import { useGetMyKpisQuery, useGetDailyReminderQuery } from 'api/apiSlice';

const PerformanceHubPage = () => {
    const { data, isLoading } = useGetMyKpisQuery();
    const { data: aiData, isLoading: aiLoading } = useGetDailyReminderQuery();

    const getStatusStyles = (status) => {
        switch (status) {
        case 'Completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'In Progress':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
  
    const iconMap = {
      TrendingUp: <TrendingUp className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      CheckCircle: <CheckCircle className="w-6 h-6" />,
      Target: <Target className="w-6 h-6" />
    };
  
    if (isLoading) {
      return (
        <DashboardLayout>
          <DashboardNavbar />
          <div className="min-h-screen p-3 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading KPI data...</p>
            </div>
          </div>
        </DashboardLayout>
      );
    }
  
    if (!data) {
      return (
        <DashboardLayout>
          <DashboardNavbar />
          <div className="min-h-screen p-3 flex items-center justify-center">
            <p className="text-gray-600">No KPI data available</p>
          </div>
        </DashboardLayout>
      );
    }
  
    const { user, kpis, summary } = data;

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />

        <div className="min-h-screen p-3">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.firstName}
                    </h1>
                    <p className="text-lg text-gray-600">
                        Here's your performance overview for this quarter
                    </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm">{new Date().toLocaleDateString()}</span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Total KPIs</p>
                        <p className="text-2xl font-bold text-gray-900">{summary.totalKpis}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{summary.completedKpis}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-blue-600">{summary.inProgressKpis}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                        <p className="text-2xl font-bold text-orange-600">{summary.avgProgress}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                </div>

                {/* KPI Cards Section */}
                <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                    My Assigned KPIs
                    </h2>
                    <Link to={"/kpi/submitkpi"}>
                        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">                   
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Submit New KPI Report</span>                   
                        </button>
                    </Link>
                </div>

                {kpis.length === 0 ? (
                    <div className="text-center py-12">
                        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No KPIs assigned yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {kpis.map((kpi) => (
                        <div key={kpi.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                        <Link to={`/kpi/details/${kpi.id}`}>
                            <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                                <div className={kpi.textColor}>
                                    {iconMap[kpi.icon] || iconMap.Target}
                                </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(kpi.status)}`}>
                                {kpi.status}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {kpi.name}
                            </h3>
                            
                            {kpi.dueDate && (
                                <div className="flex items-center text-gray-600 mb-4">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm">Due: {new Date(kpi.dueDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {kpi.progress}%
                                </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full ${kpi.progressColor} transition-all duration-500`}
                                    style={{ width: `${kpi.progress}%` }}
                                ></div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                <span>Current: {kpi.actualValue}</span>
                                <span>Target: {kpi.targetValue}</span>
                                </div>
                            </div>
                            </div>
                        </Link>
                        </div>
                    ))}
                    </div>
                )}
                </div>

                {/* AI Feedback Section */}
                <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Recent AI Feedback
                </h2>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="p-6">
                    {aiLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                            <span className="ml-3 text-gray-600">Loading AI insights...</span>
                        </div>
                    ) : aiData ? (
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className={`p-3 rounded-xl ${
                                    aiData.urgentKPI?.riskLevel === 'critical' ? 'bg-red-100' :
                                    aiData.urgentKPI?.riskLevel === 'high' ? 'bg-orange-100' :
                                    aiData.urgentKPI?.riskLevel === 'medium' ? 'bg-yellow-100' :
                                    'bg-purple-100'
                                }`}>
                                    <Lightbulb className={`w-6 h-6 ${
                                        aiData.urgentKPI?.riskLevel === 'critical' ? 'text-red-600' :
                                        aiData.urgentKPI?.riskLevel === 'high' ? 'text-orange-600' :
                                        aiData.urgentKPI?.riskLevel === 'medium' ? 'text-yellow-600' :
                                        'text-purple-600'
                                    }`} />
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    AI-Powered Insights
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {aiData.reminder}
                                </p>
                                
                                {aiData.urgentKPI && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Focus KPI: {aiData.urgentKPI.title}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                aiData.urgentKPI.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                                                aiData.urgentKPI.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                                                aiData.urgentKPI.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {aiData.urgentKPI.riskLevel} risk
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>Progress: {Math.round(aiData.urgentKPI.progress)}%</span>
                                            <span>•</span>
                                            <span>{aiData.urgentKPI.daysUntilDue} days until due</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                    aiData.urgentKPI.progress >= 75 ? 'bg-green-500' :
                                                    aiData.urgentKPI.progress >= 50 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${Math.min(aiData.urgentKPI.progress, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                
                                {aiData.urgentKPI && (
                                    <Link to={`/kpi/details/${aiData.urgentKPI.id}`}>
                                        <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium">
                                            View Detailed Analysis
                                        </button>
                                    </Link>
                                )}
                            </div>
                            
                            <div className="flex-shrink-0 hidden lg:block">
                                <div className="flex flex-col space-y-2">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{aiData.totalActiveKPIs}</div>
                                        <div className="text-xs text-gray-500">Active KPIs</div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                                            aiData.urgentKPI?.riskLevel === 'critical' ? 'bg-gradient-to-br from-red-200 to-red-300' :
                                            aiData.urgentKPI?.riskLevel === 'high' ? 'bg-gradient-to-br from-orange-200 to-orange-300' :
                                            aiData.urgentKPI?.riskLevel === 'medium' ? 'bg-gradient-to-br from-yellow-200 to-yellow-300' :
                                            'bg-gradient-to-br from-green-200 to-teal-200'
                                        }`}>
                                            <Target className="w-8 h-8 text-gray-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    All Caught Up!
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Great job! You're all caught up with your KPIs. Keep up the excellent work and continue 
                                    monitoring your performance metrics for continuous improvement.
                                </p>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>
        </div>
      </DashboardLayout>
    </>  
  );
};

export default PerformanceHubPage;