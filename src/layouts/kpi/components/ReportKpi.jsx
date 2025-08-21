
import React, { useState } from 'react';
import { useCreateKpiReportMutation } from 'api/apiSlice';

const CreateKpiReportForm = ({ kpiAssignmentId, setShowCreateModal }) => {
  
  const [createKpiReport, { isLoading, error }] = useCreateKpiReportMutation();
  
  const [formData, setFormData] = useState({
    actualValue: '', 
    period: 'daily',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.actualValue || isNaN(parseFloat(formData.actualValue))) {
      errors.actualValue = 'Actual value is required and must be a valid number';
    }
    
    if (!formData.period) {
      errors.period = 'Period is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submitting form with data:', formData);
    if (!validateForm()) {
      return;
    }

    try {
      const reportData = {
        kpiAssignmentId: parseInt(kpiAssignmentId),
        actualValue: parseFloat(formData.actualValue),
        period: formData.period,
        notes: formData.notes.trim() || null
      };

      const result = await createKpiReport(reportData).unwrap();
      
      // Reset form and close modal on success
      setFormData({
        actualValue: '',
        period: 'daily',
        notes: ''
      });
      setFormErrors({});
      setShowCreateModal(false);
      
      // Optional: Show success message or redirect
      console.log('KPI Report created successfully:', result);
      
    } catch (err) {
      console.error('Failed to create KPI report:', err);
      // Error is handled by RTK Query and displayed in the form
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create KPI Report</h3>
        
        {/* Display API Error */}
        {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error?.data?.message || 'Failed to create report. Please try again.'}
            </div>
        )}
        
        <div className="space-y-4">
            {/* Actual Value */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Value *
            </label>
            <input
                type="number"
                value={formData.actualValue}
                onChange={(e) => handleInputChange('actualValue', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.actualValue ? 'border-red-500' : 'border-gray-300'
                }`}
                step="0.1"
                placeholder="Enter actual value achieved"
            />
            {formErrors.actualValue && (
                <p className="mt-1 text-sm text-red-600">{formErrors.actualValue}</p>
            )}
            </div>
            
            {/* Period */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Reporting Period *
            </label>
            <select
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.period ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
            </select>
            {formErrors.period && (
                <p className="mt-1 text-sm text-red-600">{formErrors.period}</p>
            )}
            </div>
            
            {/* Notes */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
            </label>
            <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add any additional comments or context..."
            />
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
            <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isLoading 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            >
            {isLoading ? 'Creating...' : 'Create Report'}
            </button>
            <button
            onClick={() => {
                setShowCreateModal(false);
                setFormErrors({});
                setFormData({
                actualValue: '',
                period: 'daily',
                notes: ''
                });
            }}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
            Cancel
            </button>
        </div>
        </div>
    </div>     
  );
};

export default CreateKpiReportForm