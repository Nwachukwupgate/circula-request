// components/form/requestValidation.js
import * as yup from 'yup';

export const validationSchemas = {
  'financial': yup.object().shape({
    requestType: yup.string().required(),
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    amount: yup
      .number()
      .typeError('Amount must be a number')
      .required('Amount is required'),
    vendor: yup.string().required('Vendor is required'),
    paymentMethod: yup.string().required('Payment Method is required'),
    dateNeeded: yup.date().required('Date Needed is required'),
  }),

  'it_support': yup.object().shape({
    requestType: yup.string().required(),
    issueTitle: yup.string().required('Issue title is required'),
    description: yup.string().required('Description is required'),
    urgencyLevel: yup.string().required('Urgency level is required'),
    deviceName: yup.string().required('Device name is required'),
    location: yup.string().required('Location is required'),
    requestedItem: yup.string().required('Requested Item is required'),
  }),

  'leave_hr': yup.object().shape({
    requestType: yup.string().required(),
    employeeName: yup.string().required('Employee name is required'),
    leaveType: yup.string().required('Leave type is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date().required('End date is required'),
    reason: yup.string().required('Reason is required'),
    supervisorName: yup.string().required('Supervisor name is required'),
  }),

  'procurement': yup.object().shape({
    requestType: yup.string().required(),
    itemName: yup.string().required('Item name is required'),
    description: yup.string().required('Description is required'),
    quantity: yup
      .number()
      .typeError('Quantity must be a number')
      .required('Quantity is required'),
    preferredVendor: yup.string().required('Preferred vendor is required'),
    expectedDeliveryDate: yup.date().required('Expected delivery date is required'),
    justification: yup.string().required('Justification is required'),
  }),

  'general_admin': yup.object().shape({
    requestType: yup.string().required(),
    requestTitle: yup.string().required('Request title is required'),
    description: yup.string().required('Description is required'),
    department: yup.string().required('Department is required'),
    dateNeeded: yup.date().required('Date needed is required'),
    location: yup.string().required('Location is required'),
  }),
};
