import React from 'react';
import { Alert, AlertTitle, Box, IconButton, Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { X, AlertCircle, ChevronRight } from 'lucide-react';

/**
 * ValidationErrorBanner - Displays validation errors in a prominent, user-friendly banner
 * 
 * Features:
 * - Positioned near the form (not in corner)
 * - Persistent until dismissed
 * - Lists all errors clearly
 * - Can scroll to problematic fields
 */
const ValidationErrorBanner = ({ 
  errors = [], 
  onDismiss, 
  title = "Please fix the following errors",
  onFieldClick 
}) => {
  if (!errors || errors.length === 0) return null;

  const handleFieldClick = (fieldName) => {
    if (onFieldClick) {
      onFieldClick(fieldName);
    } else {
      // Try to scroll to and focus the field
      const field = document.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => field.focus(), 300);
      }
    }
  };

  return (
    <Collapse in={errors.length > 0}>
      <Alert 
        severity="error"
        sx={{
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'error.light',
          '& .MuiAlert-icon': {
            alignItems: 'flex-start',
            pt: 1
          }
        }}
        action={
          onDismiss && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onDismiss}
            >
              <X size={18} />
            </IconButton>
          )
        }
      >
        <AlertTitle sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </AlertTitle>
        <List dense sx={{ py: 0 }}>
          {errors.map((error, index) => (
            <ListItem 
              key={index}
              sx={{ 
                py: 0.5, 
                px: 0,
                cursor: error.field ? 'pointer' : 'default',
                '&:hover': error.field ? { 
                  bgcolor: 'rgba(0,0,0,0.04)',
                  borderRadius: 1 
                } : {}
              }}
              onClick={() => error.field && handleFieldClick(error.field)}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <ChevronRight size={16} color="#d32f2f" />
              </ListItemIcon>
              <ListItemText 
                primary={typeof error === 'string' ? error : error.message}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: 'error.dark'
                }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'error.dark', opacity: 0.8 }}>
          💡 Click on an error to jump to that field
        </Box>
      </Alert>
    </Collapse>
  );
};

/**
 * InlineFieldError - Shows error message directly under a form field
 */
export const InlineFieldError = ({ error, show = true }) => {
  if (!error || !show) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        mt: 0.5,
        color: 'error.main',
        fontSize: '0.75rem',
      }}
    >
      <AlertCircle size={14} />
      <span>{error}</span>
    </Box>
  );
};

/**
 * formatValidationErrors - Converts Yup validation errors to a standard format
 */
export const formatValidationErrors = (yupError) => {
  if (!yupError) return [];
  
  if (yupError.inner && yupError.inner.length > 0) {
    return yupError.inner.map(err => ({
      field: err.path,
      message: err.message
    }));
  }
  
  return [{
    field: yupError.path,
    message: yupError.message
  }];
};

/**
 * useFormValidation - Hook for managing form validation state
 */
export const useFormValidation = () => {
  const [errors, setErrors] = React.useState([]);
  const [fieldErrors, setFieldErrors] = React.useState({});

  const setValidationErrors = (yupError) => {
    const formatted = formatValidationErrors(yupError);
    setErrors(formatted);
    
    // Also set field-level errors
    const fieldErrs = {};
    formatted.forEach(err => {
      if (err.field) {
        fieldErrs[err.field] = err.message;
      }
    });
    setFieldErrors(fieldErrs);
  };

  const clearErrors = () => {
    setErrors([]);
    setFieldErrors({});
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    setErrors(prev => prev.filter(e => e.field !== fieldName));
  };

  return {
    errors,
    fieldErrors,
    setValidationErrors,
    clearErrors,
    clearFieldError,
    hasErrors: errors.length > 0
  };
};

export default ValidationErrorBanner;

