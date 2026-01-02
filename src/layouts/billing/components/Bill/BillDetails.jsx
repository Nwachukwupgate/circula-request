import React, { useState, useMemo } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { useGetRequestIDQuery, useUpdateRequestStatusMutation, useGetProfileQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';


function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

// Skeleton loader component for request details
const RequestDetailsSkeleton = () => (
    <Box sx={{ p: 3 }}>
        {/* Progress bar skeleton */}
        <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1, mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                {[1, 2, 3].map((i) => (
                    <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={80} sx={{ mt: 1 }} />
                    </Box>
                ))}
            </Box>
        </Box>
        
        {/* Fields skeleton */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Box key={i}>
                    <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
                </Box>
            ))}
        </Box>
        
        {/* Description skeleton */}
        <Box sx={{ mt: 3, gridColumn: 'span 2' }}>
            <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
        </Box>
        
        {/* Approvers skeleton */}
        <Box sx={{ mt: 4 }}>
            <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
            {[1, 2].map((i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="rectangular" height={70} sx={{ borderRadius: 1 }} />
                    </Box>
                </Box>
            ))}
        </Box>
    </Box>
);

// Error state component
const RequestDetailsError = ({ onRetry }) => (
    <Box sx={{ 
        p: 6, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
    }}>
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <X size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Failed to load request details</h3>
        <p className="text-sm text-gray-500 mb-4">
            There was an error loading the request information. Please try again.
        </p>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
            Try Again
        </button>
    </Box>
);

export default function DraggableDialog({ open = true, onClose = () => {}, id = 1 }) {
    const { data: info } = useGetProfileQuery();
    const [status, setStatus] = useState('');
    const [comment, setComment] = useState('');
    const [updateRequestStatus, { isLoading }] = useUpdateRequestStatusMutation();
    const { data, isLoading: isLoadingRequest, isError, refetch } = useGetRequestIDQuery(id);

    const renderField = (label, value, spanFull = false, customRender = null) => {
        if (!value) return null;

        return (
            <div className={`space-y-2 ${spanFull ? 'md:col-span-2' : ''}`}>
                <label className="text-sm font-semibold text-gray-700">
                    {label}
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {customRender ? (
                        customRender(value)
                    ) : (
                        <div className="text-sm text-gray-900">
                            {value}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const userApproval = data?.approvers?.find(
        (approver) => approver.userId === info?.id && approver.approvalStatus === 'pending'
    );

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleComment = (event) => {
        setComment(event.target.value);
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const sortedApprovers = useMemo(() => {
        if (!data?.approvers?.length) return [];
        return [...data.approvers].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [data]);


    // 1. Extract dynamic steps from approvers
    const steps = useMemo(() => {
        return sortedApprovers.map((approver) => {
            const roleName = capitalize(approver?.Role?.name ?? "Unknown");
            return `${roleName} Approver`;
        });
    }, [sortedApprovers]);

    // 2. Determine active step based on first non-approved approver
    const activeStep = useMemo(() => {
        const index = sortedApprovers.findIndex(
            (approver) =>
            approver.approvalStatus !== "approved" &&
            approver.approvalStatus !== "paid"
        );

        console.log("Sorted Approvers:", sortedApprovers);
        console.log("Approvers index:", index);

        return index === -1 ? sortedApprovers.length : index;
    }, [sortedApprovers]);

    if (!open) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateRequestStatus({ id, status, comment }).unwrap();
            toast.success("Successful!");
        } catch (error) {
            toast.error("Failed, Try again");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            maxWidth="md" // Adjust size here
            fullWidth
        >
            <DialogTitle
                style={{ cursor: 'move' }}
                id="draggable-dialog-title"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 relative cursor-move">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-semibold mb-2">Request Details</h2>
                    <p className="text-sm opacity-90">Approval Process Management</p>
                </div>
            </DialogTitle>

            <DialogContent>
                {/* Loading State */}
                {isLoadingRequest && <RequestDetailsSkeleton />}
                
                {/* Error State */}
                {isError && !isLoadingRequest && <RequestDetailsError onRetry={refetch} />}
                
                {/* Content - only show when data is loaded */}
                {!isLoadingRequest && !isError && data && (
                <>
                {/* Progress Section */}
                <div className="bg-white p-6 border-b border-gray-200">
                    <div className="mb-6">
                        {/* Progress Bar */}
                        <div className="relative mb-4 w-full">
                            <div className="absolute inset-0 top-5 h-1 bg-gray-200 rounded-full"></div>
                            <div 
                                className="absolute inset-y-0 left-0 top-5 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((activeStep / (steps.length || 1)) * 100, 100)}%` }}
                            ></div>
                        </div>

                        <div className="flex w-full items-start">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 relative">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 z-10 ${
                                    index === activeStep
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/40'
                                        : index < activeStep
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <div
                                    className={`mt-2 text-center w-full px-1 text-xs leading-tight break-words ${
                                    index === activeStep ? 'text-green-600 font-semibold' : 'text-gray-500'
                                    }`}
                                >
                                    {step}
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {renderField('Requestor Name', `${data?.user?.firstName} ${data?.user?.surname}`)}
                        {renderField('Department', `${data?.requestDepartment?.name}/${data?.role?.name}`)}
                        {renderField('Request Type', data?.requestType)}
                        {renderField('Request Title', data?.requestTitle)}
                        {renderField('Title', data?.title)}
                        {renderField('Item Requested', data?.itemName)}
                        {renderField('Requested Item', data?.requestedItem)}
                        {renderField('Issue Title', data?.issueTitle)}
                        {renderField('Device Name', data?.deviceName)}
                        {renderField('Urgency Level', data?.urgencyLevel)}
                        {renderField('Leave Type', data?.leaveType)}
                        {renderField('Location', data?.location)}
                        {renderField('Amount', data?.amount)}
                        {renderField('Date Needed', data?.dateNeeded ? new Date(data?.dateNeeded).toLocaleDateString() : null)}
                        {renderField('Preferred Vendor', data?.preferredVendor)}
                        {renderField('Quantity', data?.quantity)}
                        {renderField('Payment Method', data?.paymentMethod)}
                        {renderField(
                            'Final Status',
                            data?.finalStatus,
                            false,
                            (status) => (
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                    status === 'approved' ? 'bg-green-100 text-green-800' :
                                    status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {status}
                                </span>
                            )
                        )}
                        {renderField('Supervisor Name', data?.supervisorName)}
                        {renderField('Expected Delivery Date', data?.expectedDeliveryDate ? new Date(data?.expectedDeliveryDate).toLocaleDateString() : null)}
                        {renderField('Start Date', data?.startDate ? new Date(data?.startDate).toLocaleDateString() : null)}
                        {renderField('End Date', data?.endDate ? new Date(data?.endDate).toLocaleDateString() : null)}
                        {renderField('Urgency Level', data?.urgencyLevel)}
                        {renderField('Justification', data?.justification, true)}
                        {renderField('Reason', data?.reason, true)}
                        {renderField('Description', data?.description, true)}
                        {renderField('Comment', data?.comment, true)}

                        {data?.imageUrl && renderField(
                            'Image',
                            <span
                                onClick={() => window.open(data.imageUrl, '_blank')}
                                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer underline break-all"
                            >
                                {data.imageUrl}
                            </span>,
                            true
                        )}
                    </div>

                    {data?.approvers?.length > 0 && (
                        <div className="mt-10">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Approver Comments</h3>
                            <div className="space-y-4">
                                {data.approvers.map((approver, index) => {
                                    const fullName = `${approver?.user?.firstName ?? ''} ${approver?.user?.surname ?? ''}`;
                                    const roleName = approver?.Role?.name ?? '';
                                    const comment = approver?.comment;
                                    const status = approver?.approvalStatus;

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {fullName.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                                    <div className="text-sm font-medium text-gray-700 mb-1">
                                                        {fullName} - {roleName} <span className={`ml-2 text-xs text-gray-400 ${
                                                            status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>{status}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-800">{comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Action Section for Authorized Users */}
                    {userApproval && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Action Required
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="approved">Approve</option>
                                        <option value="rejected">Reject</option>
                                        {info?.role?.name === "Account HOD" && (
                                            <option value="paid">Pay</option>
                                        )}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Comment
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={handleComment}
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter your comment..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </>
                )}

                {/* Footer */}
                <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isLoadingRequest || isError ? 'Close' : 'Cancel'}
                    </button>
                    {!isLoadingRequest && !isError && userApproval && (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !status}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                            {isLoading ? 'Processing...' : `${status || 'Submit'} Request`}
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}