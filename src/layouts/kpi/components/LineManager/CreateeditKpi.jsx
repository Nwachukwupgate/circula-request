import React from 'react'
import { X, Save, Loader } from 'lucide-react';

const CreateeditKpi = ({showCreateModal, loading, formData, updateKPI, createKPI, resetForm, setFormData, setShowCreateModal, setShowEditModal, metricTypes, departments}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
            {showCreateModal ? 'Create New KPI' : 'Edit KPI'}
        </h2>
        <button
            onClick={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            resetForm();
            }}
            className="text-gray-400 hover:text-gray-600"
        >
            <X className="w-6 h-6" />
        </button>
        </div>
        <div className="p-6 space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
            </label>
            <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter KPI title"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
            </label>
            <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter KPI description"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
            </label>
            <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Select Department</option>
                {departments?.map((dept) => (
                <option key={dept?.id} value={dept?.id}>
                    {dept?.name}
                </option>
                ))}
            </select>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Metric Type <span className="text-red-500">*</span>
            </label>
            <select
                value={formData.metricType}
                onChange={(e) => setFormData({ ...formData, metricType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Select Type</option>
                {metricTypes.map((type) => (
                <option key={type.value} value={type.value}>
                    {type.label}
                </option>
                ))}
            </select>
            </div>
        </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t">
        <button
            onClick={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            resetForm();
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
            Cancel
        </button>
        <button
            onClick={showCreateModal ? createKPI : updateKPI}
            disabled={!formData.title || !formData.metricType || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
            {loading ? (
            <>
                <Loader className="w-4 h-4 animate-spin" />
                {showCreateModal ? 'Creating...' : 'Updating...'}
            </>
            ) : (
            <>
                <Save className="w-4 h-4" />
                {showCreateModal ? 'Create KPI' : 'Update KPI'}
            </>
            )}
        </button>
        </div>
    </div>
    </div>
  )
}

export default CreateeditKpi