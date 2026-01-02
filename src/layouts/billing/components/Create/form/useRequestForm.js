// components/form/useRequestForm.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useCreateRequestMutation, useGetEveryEmployeeQuery } from 'api/apiSlice';
import { validationSchemas } from './requestValidation';
import { getCurrencyFromIP, getCurrencyFromLocale } from 'utils/currencyDetector';
import { formatValidationErrors } from 'components/ValidationErrorBanner';

const initialFormState = {
  requestType: '',
  title: '',
  description: '',
  dateNeeded: '',
  amount: '',
  currency: 'USD', // Default, will be updated based on location
  currencySymbol: '$',
  vendor: '',
  paymentMethod: '',
  attachment: '',
  approvers: [],
};

export const useRequestForm = (handleClose) => {
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [addedLeads, setAddedLeads] = useState([]);
  const [currencyDetected, setCurrencyDetected] = useState(false);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [createRequest, { isLoading, isSuccess, error }] = useCreateRequestMutation();
  const { data: employees } = useGetEveryEmployeeQuery();

  // Detect user's currency on mount
  useEffect(() => {
    const detectCurrency = async () => {
      if (currencyDetected) return;
      
      try {
        // First try IP-based detection
        const currency = await getCurrencyFromIP();
        setFormValues(prev => ({
          ...prev,
          currency: currency.code,
          currencySymbol: currency.symbol,
        }));
        setCurrencyDetected(true);
      } catch (error) {
        // Fallback to locale-based detection
        const localeCurrency = getCurrencyFromLocale();
        setFormValues(prev => ({
          ...prev,
          currency: localeCurrency.code,
          currencySymbol: localeCurrency.symbol,
        }));
        setCurrencyDetected(true);
      }
    };

    detectCurrency();
  }, [currencyDetected]);

  const availableEmployees = employees?.employees?.map((employee) => ({
    id: employee?.id,
    name: `${employee?.firstName} ${employee?.surname}`,
    role: employee?.role?.name ?? 'No Role',
    roleId: employee?.role?.id,
    userId: employee?.id,
   })) || [];

  useEffect(() => {
    if (isSuccess) {
      toast.success('Request created successfully!');
      handleClose();
      setFormValues(initialFormState);
      setStep(0);
    }
    if (error) {
      toast.error('Something went wrong. Try again.');
    }
  }, [isSuccess, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      setValidationErrors(prev => prev.filter(err => err.field !== name));
    }
    
    // If currency is changed, also update the symbol
    if (name === 'currency') {
      const currencySymbols = {
        NGN: '₦', USD: '$', EUR: '€', GBP: '£', GHS: '₵', 
        KES: 'KSh', ZAR: 'R', INR: '₹', AED: 'د.إ',
        CAD: 'C$', AUD: 'A$', JPY: '¥', CNY: '¥',
      };
      setFormValues((prev) => ({ 
        ...prev, 
        [name]: value,
        currencySymbol: currencySymbols[value] || value
      }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value.format('YYYY-MM-DD') }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormValues((prev) => ({ ...prev, attachment: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = async () => {
    const schema = validationSchemas[formValues.requestType];
    if (!schema) {
      setValidationErrors([{ message: 'Please select a request type first' }]);
      return;
    }

    try {
      // Clear previous errors
      setValidationErrors([]);
      setFieldErrors({});
      
      await schema.validate(formValues, { abortEarly: false });
      setStep((prev) => prev + 1);
    } catch (err) {
      // Format errors for the banner
      const errors = formatValidationErrors(err);
      setValidationErrors(errors);
      
      // Also set field-level errors for inline display
      const fieldErrs = {};
      errors.forEach(error => {
        if (error.field) {
          fieldErrs[error.field] = error.message;
        }
      });
      setFieldErrors(fieldErrs);
      
      // Scroll to the error banner
      setTimeout(() => {
        const errorBanner = document.querySelector('[data-error-banner]');
        if (errorBanner) {
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };
  
  // Clear all validation errors
  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
    setFieldErrors({});
  }, []);

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const payload = {
      ...formValues,
      approvers: addedLeads.map((lead) => ({ roleId: lead.roleId, id: lead.id, userId: lead.userId })),
    };

    try {
      await createRequest(payload);
    } catch (e) {
      toast.error('Submit failed.');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddLead = (employee) => {
    if (!addedLeads.find((lead) => lead.id === employee.id)) {
      setAddedLeads([...addedLeads, employee]);
    }
  };

  const handleRemoveLead = (id) => {
    setAddedLeads(addedLeads.filter((lead) => lead.id !== id));
  };

  return {
    step,
    formValues,
    selectedFile,
    isLoading,
    handleChange,
    handleFileChange,
    handleDateChange,
    handleNext,
    handleBack,
    handleSubmit,
    setFormValues,
    searchQuery,
    setSearchQuery,
    availableEmployees,
    addedLeads,
    handleAddLead,
    handleRemoveLead,
    // Validation state
    validationErrors,
    fieldErrors,
    clearValidationErrors,
  };
};
