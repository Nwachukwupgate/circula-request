// components/form/renderFields.js
import React from 'react';
import { TextField, Button, MenuItem, InputAdornment, Box, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { commonCurrencies } from 'utils/currencyDetector';

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

// Use common currencies from utility
const currencies = commonCurrencies.map(c => ({
  value: c.code,
  label: `${c.symbol} ${c.code}`,
  symbol: c.symbol,
  name: c.name,
}));

// Styled upload button with better visibility
const StyledUploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '12px 20px',
  border: '2px dashed #667eea',
  borderRadius: '8px',
  backgroundColor: '#f8f9ff',
  color: '#667eea',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#eef0ff',
    borderColor: '#5a6fd6',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

// Amount field with currency selector - uses detected currency as default
const AmountFieldWithCurrency = ({ name, label, value, currency, currencySymbol, onChange, required = false, error = false, helperText = '' }) => {
  // Find the current currency info
  const currentCurrency = currencies.find(c => c.value === currency) || currencies.find(c => c.value === 'USD');
  
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <TextField
        select
        name="currency"
        value={currency || 'USD'}
        onChange={onChange}
        sx={{ 
          width: 130,
          '& .MuiInputBase-root': { height: 56 },
        }}
        SelectProps={{
          MenuProps: {
            PaperProps: { sx: { maxHeight: 300 } }
          }
        }}
        helperText="Auto-detected"
      >
        {currencies.map((curr) => (
          <MenuItem key={curr.value} value={curr.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, width: 24 }}>{curr.symbol}</Typography>
              <Typography variant="body2">{curr.value}</Typography>
            </Box>
          </MenuItem>
        ))}
      </TextField>
      <TextField 
        fullWidth 
        name={name} 
        label={`${label}${required ? ' *' : ''}`}
        value={value || ''} 
        onChange={onChange} 
        margin="dense"
        type="number"
        placeholder="0.00"
        error={error}
        helperText={helperText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Typography sx={{ fontWeight: 600, color: error ? '#d32f2f' : '#667eea', fontSize: '1.1rem' }}>
                {currencySymbol || currentCurrency?.symbol || '$'}
              </Typography>
            </InputAdornment>
          ),
        }}
        sx={{ 
          flex: 1,
          '& .MuiInputBase-root': { height: 56 },
        }}
      />
    </Box>
  );
};

export const renderFieldsByRequestType = (formValues, handleChange, handleDateChange, handleFileChange, fieldErrors = {}) => {
  switch (formValues.requestType) {
    case 'financial':
      return (
        <>
          <TextField 
            fullWidth 
            name="title" 
            label="Title *" 
            value={formValues.title || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            placeholder="Enter a descriptive title for your request"
            error={!!fieldErrors.title}
            helperText={fieldErrors.title}
          />
          <TextField 
            fullWidth 
            name="description" 
            label="Description *" 
            value={formValues.description || ''} 
            onChange={handleChange} 
            margin="dense" 
            multiline 
            rows={3}
            required
            placeholder="Provide details about your financial request"
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
          />
          <AmountFieldWithCurrency
            name="amount"
            label="Amount"
            value={formValues.amount}
            currency={formValues.currency}
            currencySymbol={formValues.currencySymbol}
            onChange={handleChange}
            required
            error={!!fieldErrors.amount}
            helperText={fieldErrors.amount}
          />
          <TextField 
            fullWidth 
            name="vendor" 
            label="Vendor *" 
            value={formValues.vendor || ''} 
            onChange={handleChange} 
            margin="dense"
            placeholder="Name of the vendor/supplier"
            error={!!fieldErrors.vendor}
            helperText={fieldErrors.vendor}
          />
          <TextField 
            select
            fullWidth 
            name="paymentMethod" 
            label="Payment Method *" 
            value={formValues.paymentMethod || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            sx={{ '& .MuiInputBase-root': { height: 56 } }}
            error={!!fieldErrors.paymentMethod}
            helperText={fieldErrors.paymentMethod}
          >
            <MenuItem value="" disabled><em>Select payment method</em></MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="cheque">Cheque</MenuItem>
            <MenuItem value="card">Corporate Card</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Needed *"
              value={formValues.dateNeeded ? dayjs(formValues.dateNeeded) : null}
              onChange={(val) => handleDateChange('dateNeeded', val)}
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  margin: 'dense',
                  required: true,
                  error: !!fieldErrors.dateNeeded,
                  helperText: fieldErrors.dateNeeded,
                } 
              }}
            />
          </LocalizationProvider>
          <StyledUploadButton 
            component="label" 
            startIcon={<CloudUploadIcon />} 
            fullWidth
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>Upload Supporting Documents</span>
              <Typography variant="caption" sx={{ color: '#9e9e9e', mt: 0.5 }}>
                PDF, Images, or Documents (Max 10MB)
              </Typography>
            </Box>
            <VisuallyHiddenInput type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
          </StyledUploadButton>
        </>
      );

    case 'it_support':
      return (
        <>
          <TextField 
            fullWidth 
            name="issueTitle" 
            label="Issue Title *" 
            value={formValues.issueTitle || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            placeholder="Briefly describe the issue"
            error={!!fieldErrors.issueTitle}
            helperText={fieldErrors.issueTitle}
          />
          <TextField 
            fullWidth 
            name="description" 
            label="Description *" 
            value={formValues.description || ''} 
            onChange={handleChange} 
            margin="dense" 
            multiline 
            rows={3}
            required
            placeholder="Provide detailed information about the IT issue"
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
          />
          <TextField
            select
            fullWidth
            name="urgencyLevel"
            label="Urgency Level *"
            value={formValues.urgencyLevel || ''}
            onChange={handleChange}
            required
            sx={{ '& .MuiInputBase-root': { height: 56 } }}
            error={!!fieldErrors.urgencyLevel}
            helperText={fieldErrors.urgencyLevel || "Select based on impact to your work"}
          >
            <MenuItem value="" disabled><em>Select urgency level</em></MenuItem>
            <MenuItem value="Low">🟢 Low - Can wait a few days</MenuItem>
            <MenuItem value="Medium">🟡 Medium - Affecting productivity</MenuItem>
            <MenuItem value="High">🔴 High - Work blocked</MenuItem>
          </TextField>
          <TextField 
            fullWidth 
            name="deviceName" 
            label="Device Name *" 
            value={formValues.deviceName || ''} 
            onChange={handleChange} 
            margin="dense"
            placeholder="e.g., Laptop-JD-001, Printer-2F"
            error={!!fieldErrors.deviceName}
            helperText={fieldErrors.deviceName}
          />
          <TextField 
            fullWidth 
            name="location" 
            label="Location *" 
            value={formValues.location || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            placeholder="Your office location or desk number"
            error={!!fieldErrors.location}
            helperText={fieldErrors.location}
          />
          <TextField 
            fullWidth 
            name="requestedItem" 
            label="Requested Item *" 
            value={formValues.requestedItem || ''} 
            onChange={handleChange} 
            margin="dense"
            placeholder="If requesting new equipment, specify here"
            error={!!fieldErrors.requestedItem}
            helperText={fieldErrors.requestedItem}
          />
        </>
      );

    case 'leave_hr':
      return (
        <>
          <TextField 
            fullWidth 
            name="employeeName" 
            label="Employee Name *" 
            value={formValues.employeeName || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            placeholder="Full name of the employee"
            error={!!fieldErrors.employeeName}
            helperText={fieldErrors.employeeName}
          />
          <TextField
            select
            fullWidth
            name="leaveType"
            label="Leave Type *"
            value={formValues.leaveType || ''}
            onChange={handleChange}
            margin="dense"
            required
            sx={{ '& .MuiInputBase-root': { height: 56 } }}
            error={!!fieldErrors.leaveType}
            helperText={fieldErrors.leaveType}
          >
            <MenuItem value="" disabled><em>Select leave type</em></MenuItem>
            <MenuItem value="Annual">🏖️ Annual Leave</MenuItem>
            <MenuItem value="Sick">🏥 Sick Leave</MenuItem>
            <MenuItem value="Maternity">👶 Maternity Leave</MenuItem>
            <MenuItem value="Paternity">👨‍👧 Paternity Leave</MenuItem>
            <MenuItem value="Unpaid">📋 Unpaid Leave</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date *"
                value={formValues.startDate ? dayjs(formValues.startDate) : null}
                onChange={(val) => handleDateChange('startDate', val)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true, 
                    margin: 'dense',
                    required: true,
                    error: !!fieldErrors.startDate,
                    helperText: fieldErrors.startDate,
                  } 
                }}
              />
              <DatePicker
                label="End Date *"
                value={formValues.endDate ? dayjs(formValues.endDate) : null}
                onChange={(val) => handleDateChange('endDate', val)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true, 
                    margin: 'dense',
                    required: true,
                    error: !!fieldErrors.endDate,
                    helperText: fieldErrors.endDate,
                  } 
                }}
              />
            </Box>
          </LocalizationProvider>
          <TextField 
            fullWidth 
            name="reason" 
            label="Reason *" 
            value={formValues.reason || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            multiline
            rows={2}
            placeholder="Briefly explain the reason for your leave"
            error={!!fieldErrors.reason}
            helperText={fieldErrors.reason}
          />
          <TextField 
            fullWidth 
            name="supervisorName" 
            label="Supervisor Name *" 
            value={formValues.supervisorName || ''} 
            onChange={handleChange} 
            margin="dense"
            placeholder="Name of your direct supervisor"
            error={!!fieldErrors.supervisorName}
            helperText={fieldErrors.supervisorName}
          />
        </>
      );

    case 'procurement':
      return (
        <>
          <TextField 
            fullWidth 
            name="itemName" 
            label="Item Name *" 
            value={formValues.itemName || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            placeholder="Name of the item you want to procure"
            error={!!fieldErrors.itemName}
            helperText={fieldErrors.itemName}
          />
          <TextField 
            fullWidth 
            name="description" 
            label="Description *" 
            value={formValues.description || ''} 
            onChange={handleChange} 
            margin="dense" 
            multiline 
            rows={3}
            required
            placeholder="Detailed specifications of the item"
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              name="quantity" 
              label="Quantity *" 
              value={formValues.quantity || ''} 
              onChange={handleChange} 
              margin="dense"
              type="number"
              required
              sx={{ width: 150 }}
              InputProps={{ inputProps: { min: 1 } }}
              error={!!fieldErrors.quantity}
              helperText={fieldErrors.quantity}
            />
            <AmountFieldWithCurrency
              name="amount"
              label="Estimated Cost"
              value={formValues.amount}
              currency={formValues.currency}
              currencySymbol={formValues.currencySymbol}
              onChange={handleChange}
            />
          </Box>
          <TextField 
            fullWidth 
            name="preferredVendor" 
            label="Preferred Vendor *" 
            value={formValues.preferredVendor || ''} 
            onChange={handleChange} 
            margin="dense"
            placeholder="Suggested supplier"
            error={!!fieldErrors.preferredVendor}
            helperText={fieldErrors.preferredVendor}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expected Delivery Date *"
              value={formValues.expectedDeliveryDate ? dayjs(formValues.expectedDeliveryDate) : null}
              onChange={(val) => handleDateChange('expectedDeliveryDate', val)}
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  margin: 'dense',
                  required: true,
                  error: !!fieldErrors.expectedDeliveryDate,
                  helperText: fieldErrors.expectedDeliveryDate,
                } 
              }}
            />
          </LocalizationProvider>
          <TextField 
            fullWidth 
            name="justification" 
            label="Justification *" 
            value={formValues.justification || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            multiline
            rows={2}
            placeholder="Why is this procurement necessary?"
            error={!!fieldErrors.justification}
            helperText={fieldErrors.justification}
          />
        </>
      );

    case 'general_admin':
      return (
        <>
          <TextField 
            fullWidth 
            name="requestTitle" 
            label="Request Title *" 
            value={formValues.requestTitle || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            placeholder="Brief title for your administrative request"
            error={!!fieldErrors.requestTitle}
            helperText={fieldErrors.requestTitle}
          />
          <TextField 
            fullWidth 
            name="department" 
            label="Department *" 
            value={formValues.department || ''} 
            onChange={handleChange} 
            margin="dense"
            required
            placeholder="Your department name"
            error={!!fieldErrors.department}
            helperText={fieldErrors.department}
          />
          <TextField 
            fullWidth 
            name="description" 
            label="Description *" 
            value={formValues.description || ''} 
            onChange={handleChange} 
            margin="dense" 
            multiline 
            rows={3}
            required
            placeholder="Detailed description of what you need"
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Needed *"
              value={formValues.dateNeeded ? dayjs(formValues.dateNeeded) : null}
              onChange={(val) => handleDateChange('dateNeeded', val)}
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  margin: 'dense',
                  required: true,
                  error: !!fieldErrors.dateNeeded,
                  helperText: fieldErrors.dateNeeded,
                } 
              }}
            />
          </LocalizationProvider>
          <TextField 
            fullWidth 
            name="location" 
            label="Location *" 
            value={formValues.location || ''} 
            onChange={handleChange} 
            margin="dense"
            placeholder="Relevant location for this request"
            error={!!fieldErrors.location}
            helperText={fieldErrors.location}
          />
          <StyledUploadButton 
            component="label" 
            startIcon={<AttachFileIcon />} 
            fullWidth
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>Attach Supporting Files (Optional)</span>
              <Typography variant="caption" sx={{ color: '#9e9e9e', mt: 0.5 }}>
                PDF, Images, or Documents (Max 10MB)
              </Typography>
            </Box>
            <VisuallyHiddenInput type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
          </StyledUploadButton>
        </>
      );

    // Add other cases...
    default:
      return null;
  }
};
