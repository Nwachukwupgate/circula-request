import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Users, Building, BarChart3, AlertCircle, CheckCircle, Loader, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import CreateeditKpi from 'layouts/kpi/components/LineManager/CreateeditKpi';
import { useCreateKpiMutation, useGetProfileQuery, useGetDepartmentQuery, useGetKpiTemplatesQuery, useUpdateTemplateMutation, useDeleteTemplateMutation } from 'api/apiSlice';
import KpiFilters from 'layouts/kpi/components/LineManager/KpiFilter';


const CreateKpis = () => {
  const [kpis, setKpis] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterMetricType, setFilterMetricType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [createKpi, {data, isLoading}] = useCreateKpiMutation()
  const {data: profile, } = useGetProfileQuery();
  const {data: departments} = useGetDepartmentQuery();
  const [updateTemplate, {isLoading: isUpdating}] = useUpdateTemplateMutation();
  const [deleteTemplate, {isLoading: isDeleting}] = useDeleteTemplateMutation();

  const { data: filteredKpis, error, isLoading: kpiLoading } = useGetKpiTemplatesQuery({
    search: searchTerm,
    departmentId: filterDepartment,
    metricType: filterMetricType,
    page: page,
    limit: limit,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    metricType: '',
    assignmentCount: 0,
  });

  const metricTypes = [
    { value: 'count', label: 'Count' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'score', label: 'Score' }
  ];

  const createKPI = async () => {
    try {
      // Simulate API call
      await createKpi(formData).unwrap()
      setShowCreateModal(false);
      resetForm();
      showNotification('KPI created successfully', 'success');
    } catch (error) {
      showNotification('Error creating KPI', 'error');
    } 
  };

  const updateKPI = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await updateTemplate({ id: selectedKpi.id, ...formData }).unwrap();
      setShowEditModal(false);
      setSelectedKpi(null);
      resetForm();
      showNotification('KPI updated successfully', 'success');
    } catch (error) {
      showNotification('Error updating KPI', 'error');
    } 
  };

  const deleteKPI = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await deleteTemplate(selectedKpi.id).unwrap();
      
      setShowDeleteModal(false);
      setSelectedKpi(null);
      showNotification('KPI deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting KPI', 'error');
    } 
  };

  // Helper Functions
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      departmentId: '',
      metricType: '',
    });
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleEdit = (kpi) => {
    setSelectedKpi(kpi);
    setFormData({
      title: kpi.title,
      description: kpi.description,
      departmentId: kpi.departmentId,
      metricType: kpi.metricType,
      createdBy: kpi.createdBy
    });
    setShowEditModal(true);
  };

  const handleDelete = (kpi) => {
    setSelectedKpi(kpi);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMetricTypeDisplay = (type) => {
    const metric = metricTypes.find(m => m.value === type);
    return metric ? metric.label : type;
  };

  const getMetricTypeColor = (type) => {
    switch (type) {
      case 'count': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'percentage': return 'bg-green-100 text-green-800 border-green-200';
      case 'score': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
            <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">KPI Management</h1>
                    <p className="text-gray-600">Manage KPI templates and assignments</p>
                    </div>
                    <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                    <Plus className="w-4 h-4" />
                    Create KPI
                    </button>
                </div>
                </div>

                <KpiFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterDepartment={filterDepartment} setFilterDepartment={setFilterDepartment} filterMetricType={filterMetricType} setFilterMetricType={setFilterMetricType} departments={departments} metricTypes={metricTypes} />

                {/* KPI List */}
                <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">KPI Templates ({filteredKpis?.data?.length})</h2>
                </div>
                
                {kpiLoading ? (
                    <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading KPIs...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            KPI Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Metric Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignments
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredKpis?.data?.map((kpi) => (
                            <tr key={kpi?.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div>
                                <div className="text-sm font-medium text-gray-900">
                                    {kpi?.title}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {kpi?.description}
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-900">{kpi?.departmentName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMetricTypeColor(kpi?.metricType)}`}>
                                <BarChart3 className="w-3 h-3" />
                                {getMetricTypeDisplay(kpi?.metricType)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{kpi?.assignmentCount}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                {formatDate(kpi?.createdAt)}
                                </div>
                                <div className="text-sm text-gray-500">
                                by {kpi?.createdByName}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(kpi)}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                    title="Edit KPI"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(kpi)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                    title="Delete KPI"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>                                     
                    </table>
                    
                    {/* Pagination */}
                    {filteredKpis?.data && (
                      <div className="border-t bg-white px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                          {/* Results Info & Items Per Page */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="text-sm text-gray-700">
                              Showing{' '}
                              <span className="font-medium">
                                {Math.min((page - 1) * limit + 1, filteredKpis.pagination.total)}
                              </span>{' '}
                              to{' '}
                              <span className="font-medium">
                                {Math.min(page * limit, filteredKpis.pagination.total)}
                              </span>{' '}
                              of{' '}
                              <span className="font-medium">{filteredKpis.pagination.totalPages}</span>{' '}
                              results
                            </div>
                            
                            {/* Items per page selector */}
                            <div className="flex items-center gap-2">
                              <label htmlFor="limit" className="text-sm text-gray-700">
                                Show:
                              </label>
                              <select
                                id="limit"
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>
                              <span className="text-sm text-gray-700">per page</span>
                            </div>
                          </div>

                          {/* Pagination Controls */}
                          {filteredKpis.pagination.totalPages > 1 && (
                            <div className="flex justify-end w-full sm:justify-end items-center gap-1">
                              {/* First page */}
                              <button
                                onClick={() => setPage((prev) => prev - 1)}
                                disabled={page <= 1}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                title="First page"
                              >
                                <ChevronsLeft className="w-4 h-4" />
                              </button>

                              {/* Previous page */}
                              <button
                                onClick={() => setPage((prev) => prev - 1)}
                                disabled={page <= 1}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                title="Previous page"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>


                              {/* Next page */}
                              <button
                                onClick={() => setPage((prev) => prev + 1)}
                                disabled={page >= filteredKpis.pagination.totalPages}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                title="Next page"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>

                              {/* Last page */}
                              <button
                                onClick={() => setPage((prev) => prev + 1)}
                                disabled={page >= filteredKpis.pagination.totalPages}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                title="Last page"
                              >
                                <ChevronsRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {filteredKpis?.data?.length === 0 && !loading && (
                        <div className="text-center py-12">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No KPIs found matching your criteria</p>
                        </div>
                    )}
                    </div>
                )}
                </div>

            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || showEditModal) && (
                <CreateeditKpi showCreateModal={showCreateModal} loading={isLoading || isUpdating} formData={formData} updateKPI={updateKPI} createKPI={createKPI} resetForm={resetForm} setFormData={setFormData} setShowCreateModal={setShowCreateModal} setShowEditModal={setShowEditModal} metricTypes={metricTypes} departments={departments} />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Delete KPI</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete "{selectedKpi?.title}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                        onClick={() => {
                            setShowDeleteModal(false);
                            setSelectedKpi(null);
                        }}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={deleteKPI}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                        {isDeleting ? (
                            <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Deleting...
                            </>
                        ) : (
                            <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                            </>
                        )}
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            )}

            {/* Notification */}
            {notification.show && (
                <div className="fixed top-4 right-4 z-50">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
                    notification.type === 'success' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                    {notification.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                    ) : (
                    <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{notification.message}</span>
                </div>
                </div>
            )}
            </div>
        <Footer />
    </DashboardLayout>
  );
};

export default CreateKpis;