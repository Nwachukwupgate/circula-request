import React, { useState } from 'react';
import { TextField, Button, Menu, MenuItem } from '@mui/material';
import { ChevronDown, FileText, Calendar, Target, MessageSquare, CheckCircle, ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Link } from 'react-router-dom';


const SubmitKPIForm = () => {
  const [formData, setFormData] = useState({
    kpi: '',
    actualValue: '',
    reportingPeriod: '',
    notes: '',
    attachments: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const kpiOptions = [
    { value: 'sales-growth', label: 'Sales Growth', target: '15%', current: '75%' },
    { value: 'customer-satisfaction', label: 'Customer Satisfaction', target: '90%', current: '100%' },
    { value: 'project-completion', label: 'Project Completion Rate', target: '85%', current: '50%' },
    { value: 'revenue-target', label: 'Revenue Target', target: '$500K', current: '65%' },
    { value: 'team-productivity', label: 'Team Productivity', target: '95%', current: '80%' }
  ];

  const reportingPeriods = [
    { value: 'q1-2025', label: 'Q1 2025' },
    { value: 'q2-2025', label: 'Q2 2025' },
    { value: 'q3-2025', label: 'Q3 2025' },
    { value: 'july-2025', label: 'July 2025' },
    { value: 'june-2025', label: 'June 2025' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-6">Your KPI report has been successfully submitted and is now under review.</p>
          <button 
            onClick={() => {setSubmitted(false); setFormData({kpi: '', actualValue: '', reportingPeriod: '', notes: '', attachments: null});}}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }


  return (
    <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
            <div className="min-h-screen p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link to={"/kpi"}>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Dashboard</span>
                            </button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit KPI Report</h1>
                    <p className="text-gray-600">Update your key performance indicators and track your progress</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="space-y-10">
                        {/* KPI Selection */}
                        <div className=" ">
                            <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Select KPI</h3>
                                <p className="text-sm text-gray-600">Choose the KPI you want to report on</p>
                            </div>
                            </div>
                            
                            <div className="relative">
                            <select 
                                value={formData.kpi}
                                onChange={(e) => handleInputChange('kpi', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900"
                                required
                            >
                                <option value="">Select a KPI...</option>
                                {kpiOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label} (Target: {option.target})
                                </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className='flex gap-x-6'>
                            {/* Actual Value */}
                            <div className="">
                                <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Actual Value</h3>
                                    <p className="text-sm text-gray-600">Enter the current value or percentage achieved</p>
                                </div>
                                </div>
                                
                                <input
                                type="text"
                                value={formData.actualValue}
                                onChange={(e) => handleInputChange('actualValue', e.target.value)}
                                placeholder="e.g., 75%, $450K, 12.5%"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                required
                                />
                            </div>

                            {/* Reporting Period */}
                            <div className="">
                                <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Reporting Period</h3>
                                    <p className="text-sm text-gray-600">Select the time period for this report</p>
                                </div>
                                </div>
                                
                                <div className="relative">
                                <select 
                                    value={formData.reportingPeriod}
                                    onChange={(e) => handleInputChange('reportingPeriod', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900"
                                    required
                                >
                                    <option value="">Select period...</option>
                                    {reportingPeriods.map(period => (
                                    <option key={period.value} value={period.value}>
                                        {period.label}
                                    </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="">
                            <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                                <p className="text-sm text-gray-600">Provide context, challenges, or achievements</p>
                            </div>
                            </div>
                            
                            <textarea
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Share any relevant details about this KPI performance, challenges faced, or key achievements..."
                            rows="6"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="">
                            <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Upload className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
                                <p className="text-sm text-gray-600">Upload any relevant files or screenshots</p>
                            </div>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                            <p className="text-xs text-gray-500">Supports: PDF, DOC, XLS, PNG, JPG (Max 10MB)</p>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => handleInputChange('attachments', e.target.files)}
                            />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Submitting...</span>
                                </div>
                            ) : (
                                'Submit Report'
                            )}
                            </button>
                        </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Tips */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertCircle className="w-3 h-3 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600">Be specific with your actual values and include units</p>
                            </div>
                            <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-600">Include context in notes about what influenced the results</p>
                            </div>
                            <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertCircle className="w-3 h-3 text-purple-600" />
                            </div>
                            <p className="text-sm text-gray-600">Upload supporting documents to strengthen your report</p>
                            </div>
                        </div>
                        </div>

                        {/* Current Progress */}
                        {formData.kpi && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Progress</h3>
                            {(() => {
                            const selectedKPI = kpiOptions.find(k => k.value === formData.kpi);
                            if (!selectedKPI) return null;
                            
                            return (
                                <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Target</span>
                                    <span className="text-sm font-semibold text-gray-900">{selectedKPI.target}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Current</span>
                                    <span className="text-sm font-semibold text-blue-600">{selectedKPI.current}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: selectedKPI.current }}
                                    ></div>
                                </div>
                                </div>
                            );
                            })()}
                        </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        <Footer />
    </DashboardLayout>
  );
};

export default SubmitKPIForm;
