// components/KpiDashboard/KpiDashboard.jsx
import React from 'react';
import { TrendingUp, Users, CheckCircle, Clock, Plus, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import KpiCardContent from './CardContent';

const KpiDashboard = ({
  // Data props
  kpis = [],
  
  // Header configuration
  title = "KPI Dashboard",
  subtitle = "Performance overview for this quarter",
  currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  
  // Action button configuration
  showAddButton = true,
  addButtonText = "Add New KPI",
  addButtonLink = "/kpi/add",
  
  // Link configuration
  kpiDetailsLink = "/kpi/details",
  
  // Layout props
  showQuickStats = true,
  showHeader = true,
  className = "",
  
  // Custom renderers (optional)
  customKpiCard = null,
  customQuickStats = null,
  
  // Event handlers
  onKpiClick = null,
  onAddClick = null
}) => {
  
  // Calculate quick stats from KPI data
  const quickStats = React.useMemo(() => {
    const total = kpis.length;
    const completed = kpis.filter(kpi => kpi.status === 'Completed').length;
    const inProgress = kpis.filter(kpi => kpi.status === 'In Progress').length;
    const avgProgress = total > 0 ? Math.round(kpis.reduce((sum, kpi) => sum + kpi.progress, 0) / total) : 0;
    
    return { total, completed, inProgress, avgProgress };
  }, [kpis]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleKpiClick = (kpi) => {
    if (onKpiClick) {
      onKpiClick(kpi);
    }
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    }
  };

  const renderDefaultKpiCard = (kpi) => (
    <div key={kpi.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
      {kpiDetailsLink ? (
        <Link to={kpiDetailsLink} onClick={() => handleKpiClick(kpi)}>
          <KpiCardContent kpi={kpi} />
        </Link>
      ) : (
        <div onClick={() => handleKpiClick(kpi)} className="cursor-pointer">
          <KpiCardContent kpi={kpi} />
        </div>
      )}
    </div>
  );

  const renderDefaultQuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total KPIs</p>
            <p className="text-2xl font-bold text-gray-900">{quickStats.total}</p>
          </div>
          <Target className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{quickStats.completed}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{quickStats.inProgress}</p>
          </div>
          <Clock className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Progress</p>
            <p className="text-2xl font-bold text-orange-600">{quickStats.avgProgress}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-3 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {showHeader && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-lg text-gray-600">{subtitle}</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">{currentDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Bar */}
        {showQuickStats && (
          customQuickStats ? customQuickStats(quickStats) : renderDefaultQuickStats()
        )}

        {/* KPI Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              KPIs ({kpis.length})
            </h2>
            {showAddButton && (
              addButtonLink ? (
                <Link to={addButtonLink}>
                  <button 
                    onClick={handleAddClick}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >                   
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">{addButtonText}</span>                   
                  </button>
                </Link>
              ) : (
                <button 
                  onClick={handleAddClick}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >                   
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">{addButtonText}</span>                   
                </button>
              )
            )}
          </div>

          {kpis.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No KPIs Found</h3>
              <p className="text-gray-600">Get started by adding your first KPI.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kpis.map((kpi) => 
                customKpiCard ? customKpiCard(kpi) : renderDefaultKpiCard(kpi)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiDashboard;