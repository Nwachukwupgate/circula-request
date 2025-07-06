// components/form/useRequestForm.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useCreateRequestMutation, useGetEveryEmployeeQuery } from 'api/apiSlice';
import { validationSchemas } from './requestValidation';
import * as yup from 'yup';

const initialFormState = {
  requestType: '',
  title: '',
  description: '',
  dateNeeded: '',
  amount: '',
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
  const [createRequest, { isLoading, isSuccess, error }] = useCreateRequestMutation();
  const { data: employees } = useGetEveryEmployeeQuery();

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
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
        toast.error('Invalid or missing request type');
        return;
    }

    try {
        await schema.validate(formValues, { abortEarly: false });
        setStep((prev) => prev + 1);
    } catch (err) {
        if (err?.inner) {
        err.inner.forEach((e) => toast.error(e.message));
        } else {
        toast.error(err.message || 'Validation failed');
        }
    }
  };

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
    handleRemoveLead
  };
};
