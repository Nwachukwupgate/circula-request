// components/form/renderFields.js
import React from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const renderFieldsByRequestType = (formValues, handleChange, handleDateChange, handleFileChange) => {
  switch (formValues.requestType) {
    case 'financial':
      return (
        <>
          <TextField fullWidth name="title" label="Title" value={formValues.title || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="description" label="Description" value={formValues.description || ''} onChange={handleChange} margin="dense" multiline rows={3} />
          <TextField fullWidth name="amount" label="Amount" value={formValues.amount || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="vendor" label="Vendor" value={formValues.vendor || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="paymentMethod" label="Payment Method" value={formValues.paymentMethod || ''} onChange={handleChange} margin="dense" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Needed"
              value={formValues.dateNeeded ? dayjs(formValues.dateNeeded) : null}
              onChange={(val) => handleDateChange('dateNeeded', val)}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth sx={{ mt: 2 }}>
            Upload Supporting Documents
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
        </>
      );

    case 'it_support':
      return (
        <>
          <TextField fullWidth name="issueTitle" label="Issue Title" value={formValues.issueTitle || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="description" label="Description" value={formValues.description || ''} onChange={handleChange} margin="dense" multiline rows={3} />
          <TextField
            select
            fullWidth
            name="urgencyLevel"
            label="Urgency Level"
            value={formValues.urgencyLevel || ''}
            onChange={handleChange}
            sx={{height: 56, '& .MuiInputBase-root': {height: 50,},}}
          >
            {['Low', 'Medium', 'High'].map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </TextField>
          <TextField fullWidth name="deviceName" label="Device Name" value={formValues.deviceName || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="location" label="Location" value={formValues.location || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="requestedItem" label="Requested Item" value={formValues.requestedItem || ''} onChange={handleChange} margin="dense" />
        </>
      );

    case 'leave_hr':
      return (
        <>
          {/* <TextField fullWidth name="employeeName" label="Employee Name" value={formValues.employeeName || ''} onChange={handleChange} margin="dense" /> */}
          <TextField
            select
            fullWidth
            name="leaveType"
            label="Leave Type"
            value={formValues.leaveType || ''}
            onChange={handleChange}
            margin="dense"
            sx={{height: 56, '& .MuiInputBase-root': {height: 50,},}}
          >
            {['Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid'].map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={formValues.startDate ? dayjs(formValues.startDate) : null}
              onChange={(val) => handleDateChange('startDate', val)}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
            <DatePicker
              label="End Date"
              value={formValues.endDate ? dayjs(formValues.endDate) : null}
              onChange={(val) => handleDateChange('endDate', val)}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <TextField fullWidth name="reason" label="Reason" value={formValues.reason || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="supervisorName" label="Supervisor Name" value={formValues.supervisorName || ''} onChange={handleChange} margin="dense" />
          {/* <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth sx={{ mt: 2 }}>
            Upload Attachment
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button> */}
        </>
      );

    case 'procurement':
      return (
        <>
          <TextField fullWidth name="itemName" label="Item Name" value={formValues.itemName || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="description" label="Description" value={formValues.description || ''} onChange={handleChange} margin="dense" multiline rows={3} />
          <TextField fullWidth name="quantity" label="Quantity" value={formValues.quantity || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="preferredVendor" label="Preferred Vendor" value={formValues.preferredVendor || ''} onChange={handleChange} margin="dense" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Expected Delivery Date"
                value={formValues.expectedDeliveryDate ? dayjs(formValues.expectedDeliveryDate) : null}
                onChange={(val) => handleDateChange('expectedDeliveryDate', val)}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </LocalizationProvider>
          <TextField fullWidth name="justification" label="Justification" value={formValues.justification || ''} onChange={handleChange} margin="dense" />
        </>
      );

    case 'general_admin':
      return (
        <>
          <TextField fullWidth name="requestTitle" label="Request Title" value={formValues.requestTitle || ''} onChange={handleChange} margin="dense" />
          <TextField fullWidth name="description" label="Description" value={formValues.description || ''} onChange={handleChange} margin="dense" multiline rows={3} />
          {/* <TextField fullWidth name="department" label="Department" value={formValues.department || ''} onChange={handleChange} margin="dense" /> */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Needed"
              value={formValues.dateNeeded ? dayjs(formValues.dateNeeded) : null}
              onChange={(val) => handleDateChange('dateNeeded', val)}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <TextField fullWidth name="location" label="Location" value={formValues.location} onChange={handleChange} margin="dense" />
          {/* <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth sx={{ mt: 2 }}>
            Upload Attachment
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button> */}
        </>
      );

    // Add other cases...
    default:
      return null;
  }
};
