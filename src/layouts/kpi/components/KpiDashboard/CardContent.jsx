const KpiCardContent = ({ kpi }) => (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${kpi.bgColor || 'bg-blue-50'}`}>
          <div className={kpi.textColor || 'text-blue-600'}>
            {kpi.icon || <Target className="w-6 h-6" />}
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
          <span className="text-sm">Due: {kpi.dueDate}</span>
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
            className={`h-2 rounded-full ${kpi.progressColor || 'bg-blue-500'} transition-all duration-500`}
            style={{ width: `${kpi.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
);

export default KpiCardContent;