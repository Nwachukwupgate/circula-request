
import React from 'react';
import { TrendingUp, Users, CheckCircle, Clock, Plus, Lightbulb, Calendar,Target } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link } from 'react-router-dom';

const PerformanceHubPage = () => {
  const kpis = [
    {
      id: 1,
      name: 'Sales Growth',
      dueDate: '2024-12-31',
      status: 'In Progress',
      progress: 75,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      progressColor: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Customer Satisfaction',
      dueDate: '2024-11-15',
      status: 'Completed',
      progress: 100,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      progressColor: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Project Completion Rate',
      dueDate: '2024-12-31',
      status: 'In Progress',
      progress: 50,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      progressColor: 'bg-orange-500'
    }
  ];

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
                        Welcome back, Sarah
                    </h1>
                    <p className="text-lg text-gray-600">
                        Here's your performance overview for this quarter
                    </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm">July 11, 2025</span>
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
                        <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-green-600">1</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-blue-600">2</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                        <p className="text-2xl font-bold text-orange-600">75%</p>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {kpis.map((kpi) => (
                    <div key={kpi.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                        <Link to={"/kpi/details"}>
                            <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                                <div className={kpi.textColor}>
                                    {kpi.icon}
                                </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(kpi.status)}`}>
                                {kpi.status}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {kpi.name}
                            </h3>
                            
                            <div className="flex items-center text-gray-600 mb-4">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm">Due: {kpi.dueDate}</span>
                            </div>
                            
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
                            </div>
                            </div>
                        </Link>
                    </div>
                    ))}
                </div>
                </div>

                {/* AI Feedback Section */}
                <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Recent AI Feedback
                </h2>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Lightbulb className="w-6 h-6 text-purple-600" />
                        </div>
                        </div>
                        
                        <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            AI-Powered Insights
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Based on your recent performance data, the AI suggests focusing on enhancing customer 
                            engagement strategies to further boost satisfaction scores. Consider exploring new 
                            communication channels and personalized service approaches.
                        </p>
                        <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium">
                            View Detailed Analysis
                        </button>
                        </div>
                        
                        <div className="flex-shrink-0 hidden lg:block">
                        <div className="flex space-x-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-teal-200 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-8 bg-teal-600 rounded-full"></div>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg"></div>
                        </div>
                        </div>
                    </div>
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