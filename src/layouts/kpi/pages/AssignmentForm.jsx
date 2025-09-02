import React, { useState } from 'react';
import { ChevronDown, Users, Target, Calendar, FileText, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { useGetAccessibleUsersQuery, useGetAllKpiTemplatesQuery, useAssignKpiMutation } from 'api/apiSlice';
import { useNavigate } from 'react-router-dom';


const KPIAssignmentForm = () => {
  const { data: staffMembers = [] } = useGetAccessibleUsersQuery();
  const { data: kpiTemplates = [] } = useGetAllKpiTemplatesQuery();
  const [assignKpi, { isLoading: isSubmitting }] = useAssignKpiMutation();
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staffMember: '',
    template: '',
    targetValue: '',
    // period: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    staff: false,
    template: false,
    period: false
  });

  const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

  const periods = [
    { id: 1, name: 'Weekly', value: 'weekly' },
    { id: 2, name: 'Monthly', value: 'monthly' },
    { id: 3, name: 'Quarterly', value: 'quarterly' },
    { id: 4, name: 'Annual', value: 'annual' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.staffMember) newErrors.staffMember = 'Please select a staff member';
    if (!formData.template) newErrors.template = 'Please select a KPI template';
    if (!formData.targetValue) newErrors.targetValue = 'Please enter a target value';
    // if (!formData.period) newErrors.period = 'Please select a period';
    if (!formData.dueDate) newErrors.dueDate = 'Please select a due date';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      staffMember: '',
        template: '',
        targetValue: '',
        // period: '',
        description: '',
        priority: 'medium',
        dueDate: '',
    });
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
        await assignKpi(formData).unwrap();
        showNotification('KPI assigned successfully', 'success');
        resetForm();
        navigate('/team');
        // Handle success, e.g., show a success message or redirect
    } catch (error) {
        alert('Failed to assign KPI. Please try again.');
        showNotification('Error assigning KPI', 'error');
    }
  };

  const selectedStaff = staffMembers.find(s => s.id === formData.staffMember);
  const selectedTemplate = kpiTemplates.find(t => t.id === formData.template);
  const selectedPeriod = periods.find(p => p.id === formData.period);

  return (
    <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
            <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    KPI Assignment Details
                    </h2>
                </div>

                <div className="p-8 space-y-6">
                    {/* Staff Member Selection */}
                    <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="inline h-4 w-4 mr-2" />
                        Select Staff Member
                    </label>
                    <div className="relative">
                        <button
                        type="button"
                        onClick={() => toggleDropdown('staff')}
                        className={`w-full px-4 py-3 text-left bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.staffMember ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        >
                        {selectedStaff ? (
                            <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {selectedStaff.avatar}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{selectedStaff.name}</div>
                                <div className="text-sm text-gray-500">{selectedStaff.department}</div>
                            </div>
                            </div>
                        ) : (
                            <span className="text-gray-500">Choose a staff member</span>
                        )}
                        <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        </button>
                        
                        {dropdownOpen.staff && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {staffMembers.map((staff) => (
                            <button
                                key={staff.id}
                                type="button"
                                onClick={() => {
                                handleInputChange('staffMember', staff.id);
                                toggleDropdown('staff');
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {staff.avatar}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{staff.name}</div>
                                    <div className="text-sm text-gray-500">{staff.department}</div>
                                </div>
                                </div>
                            </button>
                            ))}
                        </div>
                        )}
                    </div>
                    {errors.staffMember && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.staffMember}
                        </p>
                    )}
                    </div>

                    {/* KPI Template Selection */}
                    <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Target className="inline h-4 w-4 mr-2" />
                        Select KPI Template
                    </label>
                    <div className="relative">
                        <button
                        type="button"
                        onClick={() => toggleDropdown('template')}
                        className={`w-full px-4 py-3 text-left bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.template ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        >
                        {selectedTemplate ? (
                            <div>
                            <div className="font-medium text-gray-900">{selectedTemplate.name}</div>
                            <div className="text-sm text-gray-500">{selectedTemplate.category} • {selectedTemplate.description}</div>
                            </div>
                        ) : (
                            <span className="text-gray-500">Choose a template</span>
                        )}
                        <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        </button>
                        
                        {dropdownOpen.template && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {kpiTemplates.map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => {
                                handleInputChange('template', template.id);
                                toggleDropdown('template');
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">{template.name}</div>
                                <div className="text-sm text-gray-500">{template.category} • {template.description}</div>
                            </button>
                            ))}
                        </div>
                        )}
                    </div>
                    {errors.template && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.template}
                        </p>
                    )}
                    </div>

                    {/* Target Value */}
                    <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Value
                    </label>
                    <input
                        type="text"
                        value={formData.targetValue}
                        onChange={(e) => handleInputChange('targetValue', e.target.value)}
                        placeholder="Enter target value (e.g., 85%, $50,000, 20 leads)"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.targetValue ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.targetValue && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.targetValue}
                        </p>
                    )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Add any additional notes or context for this KPI..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.dueDate && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.dueDate}
                        </p>
                    )}
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Priority Level
                    </label>
                    <div className="flex gap-3">
                        {[
                        { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
                        { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                        { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' }
                        ].map((priority) => (
                        <button
                            key={priority.value}
                            type="button"
                            onClick={() => handleInputChange('priority', priority.value)}
                            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                            formData.priority === priority.value
                                ? priority.color
                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            {priority.label}
                        </button>
                        ))}
                    </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-6">
                    <button
                        type="button"
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Assigning...
                        </>
                        ) : (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            Assign KPI
                        </>
                        )}
                    </button>
                    </div>
                </div>
                </div>
            </div>

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

export default KPIAssignmentForm;