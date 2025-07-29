import React, { useState } from 'react';
import { Edit, User, TrendingUp, FileText, Calendar, Target, Flag, X, Building, BarChart3, Loader2 } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { useGetKpiIDQuery } from 'api/apiSlice';
import { useParams } from 'react-router-dom';

const KPIDetailPage = () => {
  const { id } = useParams();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    metricType: '',
    departmentId: ''
  });
  const {data: kpiData, isLoading} = useGetKpiIDQuery(id)

  const assignmentsData = kpiData?.assignments 

  // Mock data for the KPI and assignments
//   const kpiData = {
//     id: 1,
//     title: 'Customer Satisfaction Score',
//     description: 'Monthly customer satisfaction survey results based on service quality and response time',
//     departmentId: 2,
//     departmentName: 'Customer Service',
//     metricType: 'percentage',
//     createdBy: 1,
//     createdByName: 'John Manager',
//     createdAt: '2024-01-15T10:30:00Z',
//     updatedAt: '2024-02-01T14:20:00Z'
//   };

//   const assignmentsData = [
//     {
//       id: 1,
//       staffId: 101,
//       staffName: 'Alice Johnson',
//       staffEmail: 'alice.johnson@company.com',
//       targetValue: 85.0,
//       priorityLevel: 'high',
//       description: 'Focus on reducing response time and improving first-call resolution',
//       assignedAt: '2024-01-20T09:00:00Z',
//       avatar: 'AJ'
//     },
//     {
//       id: 2,
//       staffId: 102,
//       staffName: 'Bob Smith',
//       staffEmail: 'bob.smith@company.com',
//       targetValue: 80.0,
//       priorityLevel: 'medium',
//       description: 'Improve product knowledge and customer communication skills',
//       assignedAt: '2024-01-22T11:30:00Z',
//       avatar: 'BS'
//     },
//     {
//       id: 3,
//       staffId: 103,
//       staffName: 'Carol Davis',
//       staffEmail: 'carol.davis@company.com',
//       targetValue: 90.0,
//       priorityLevel: 'high',
//       description: 'Maintain excellence in customer interactions and mentor junior staff',
//       assignedAt: '2024-01-18T08:45:00Z',
//       avatar: 'CD'
//     }
//   ];

  const departments = [
    { id: 1, name: 'Sales' },
    { id: 2, name: 'Customer Service' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'IT' }
  ];

  const handleEditClick = () => {
    setEditForm({
      title: kpiData.title,
      description: kpiData.description,
      metricType: kpiData.metricType,
      departmentId: kpiData.departmentId
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    // Handle form submission here
    console.log('Updating KPI:', editForm);
    setEditModalOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMetricTypeDisplay = (type) => {
    switch (type) {
      case 'percentage': return 'Percentage (%)';
      case 'count': return 'Count';
      case 'score': return 'Score';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
        <DashboardNavbar />
          <MDBox mb={2} />

          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <span className="text-gray-700 text-sm">Loading KPI details...</span>
                </div>
            </div>
            ) : (
            <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {kpiData?.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {formatDate(kpiData?.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        By: {kpiData?.createdByName}
                        </span>
                    </div>
                    </div>
                    <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                    <Edit className="w-4 h-4" />
                    Edit KPI
                    </button>
                </div>
                </div>

                {/* KPI Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold">KPI Details</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <p className="text-gray-900">
                            {kpiData?.description}
                        </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                            Department
                            </label>
                            <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-blue-600" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {kpiData?.departmentName}
                            </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                            Metric Type
                            </label>
                            <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                {getMetricTypeDisplay(kpiData?.metricType)}
                            </span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h2 className="text-xl font-semibold">Statistics</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                        <span className="text-gray-600">Total Assigned</span>
                        <span className="font-semibold text-lg">{kpiData?.statistics?.totalAssigned || 0}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">High Priority</span>
                        <span className="font-semibold text-lg text-red-600">
                            {kpiData?.statistics?.highPriorityCount || 0}
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">Avg Target</span>
                        <span className="font-semibold text-lg">
                            {kpiData?.statistics?.avgTarget || 0}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                {/* Assignments Table */}
                <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-semibold">Assigned Users ({assignmentsData?.length})</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Staff Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Target Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assignmentsData?.map((assignment) => (
                        <tr key={assignment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                {assignment?.avatar}
                                </div>
                                <div>
                                <div className="text-sm font-medium text-gray-900">
                                    {assignment?.staffName}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {assignment?.staffEmail}
                                </div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {assignment?.targetValue}
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(assignment?.priorityLevel)}`}>
                                <Flag className="w-3 h-3" />
                                {assignment?.priorityLevel}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                                {formatDate(assignment?.assignedAt)}
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs">
                                {assignment?.description}
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Edit KPI Template</h2>
                    <button
                        onClick={() => setEditModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    </div>
                    <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                        </label>
                        <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                        </label>
                        <textarea
                        rows={3}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <select
                            value={editForm.departmentId}
                            onChange={(e) => setEditForm({ ...editForm, departmentId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                            ))}
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Metric Type
                        </label>
                        <select
                            value={editForm.metricType}
                            onChange={(e) => setEditForm({ ...editForm, metricType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Type</option>
                            <option value="count">Count</option>
                            <option value="percentage">Percentage</option>
                            <option value="score">Score</option>
                        </select>
                        </div>
                    </div>
                    </div>
                    <div className="flex justify-end gap-3 p-6 border-t">
                    <button
                        onClick={() => setEditModalOpen(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEditSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                    </div>
                </div>
                </div>
            )}
            </div>
            )}
        <Footer />
    </DashboardLayout>
  );
};

export default KPIDetailPage;