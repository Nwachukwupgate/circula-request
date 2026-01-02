import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import MDButton from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Bill from "layouts/billing/components/Bill";
import DraggableDialog from "../Bill/BillDetails";
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import { useGetRequestQuery } from "api/apiSlice";
import { FileText, Inbox, PlusCircle } from "lucide-react";

function BillingInformation() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null)
  
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data , error, isLoading } = useGetRequestQuery({
    filter: filter === 'all' ? undefined : filter,
    startDate: filter === 'dateRange' ? startDate : undefined,
    endDate: filter === 'dateRange' ? endDate : undefined,
  });  

  const handleClickOpen = (id) => {
    setId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (newValue) => {
    setStartDate( newValue.format('YYYY-MM-DD'));
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue.format('YYYY-MM-DD'));
  };

  const handleTodayClick = () => {
    const today = dayjs().format('YYYY-MM-DD');
    setStartDate(today);
    setEndDate(today);
    setFilter('dateRange'); // or any other filter value if needed
  };

  // Function to handle the 'Yesterday' button click
  const handleYesterdayClick = () => {
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    setStartDate(yesterday);
    setEndDate(yesterday);
    setFilter('dateRange'); // or any other filter value if needed
  };

  // Empty State Component
  const EmptyState = () => (
    <MDBox 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      py={8}
      px={3}
    >
      <MDBox
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}
      >
        <Inbox size={50} color="#9e9e9e" />
      </MDBox>
      <MDTypography variant="h5" fontWeight="medium" color="text" mb={1}>
        No Requests Yet
      </MDTypography>
      <MDTypography variant="body2" color="text" textAlign="center" mb={3} sx={{ maxWidth: 320 }}>
        You haven't made any requests yet. Click the button below to create your first request.
      </MDTypography>
      <MDBox 
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#1976d2',
          fontSize: '0.875rem',
          fontWeight: 500
        }}
      >
        <PlusCircle size={18} />
        <span>Use the "Make Request" button to get started</span>
      </MDBox>
    </MDBox>
  );

  // Loading State Component
  const LoadingState = () => (
    <MDBox 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      py={8}
    >
      <CircularProgress size={48} sx={{ mb: 2 }} />
      <MDTypography variant="body2" color="text">
        Loading your requests...
      </MDTypography>
    </MDBox>
  );

  // Error State Component
  const ErrorState = () => (
    <MDBox 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      py={8}
      px={3}
    >
      <MDBox
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}
      >
        <Icon sx={{ fontSize: 40, color: '#ef4444' }}>error_outline</Icon>
      </MDBox>
      <MDTypography variant="h6" fontWeight="medium" color="text" mb={1}>
        Failed to Load Requests
      </MDTypography>
      <MDTypography variant="body2" color="text" textAlign="center">
        Something went wrong. Please try again later.
      </MDTypography>
    </MDBox>
  );

  // No Results State (for filtered searches)
  const NoResultsState = () => (
    <MDBox 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      py={6}
      px={3}
    >
      <MDBox
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}
      >
        <FileText size={36} color="#d97706" />
      </MDBox>
      <MDTypography variant="h6" fontWeight="medium" color="text" mb={1}>
        No Results Found
      </MDTypography>
      <MDTypography variant="body2" color="text" textAlign="center" mb={2}>
        No requests match your current filter criteria.
      </MDTypography>
      <MDButton
        size="small"
        color="info"
        variant="outlined"
        onClick={() => {
          setFilter('all');
          setStartDate('');
          setEndDate('');
        }}
      >
        Clear Filters
      </MDButton>
    </MDBox>
  );

  const hasFiltersApplied = filter !== 'all' || startDate || endDate;
  const hasData = data && Array.isArray(data) && data.length > 0;

  return (
    <>
    {open && <DraggableDialog open={open} onClose={handleClose} id={id} />}

    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Request Information
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <div className="cursor-pointer">
          <div className="flex flex-col lg:flex-row gap-4 mb-4 flex-wrap"> 
            <MDButton
              size="small"
              color={filter === 'all' && !startDate ? "info" : "success"}
              variant="contained"
              onClick={() => {
                setFilter('all');
                setStartDate('');
                setEndDate('');
              }}
            >
              All
            </MDButton>
            <MDButton
              size="small"
              color="success"
              variant="contained"
              type="submit"
              onClick={handleTodayClick}
            >
              Today
            </MDButton>          
            <MDButton
              size="small"
              color="success"
              variant="contained"
              type="submit"
              onClick={handleYesterdayClick}
            >
              Yesterday
            </MDButton>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate ? dayjs(startDate) : null}
                onChange={handleDateChange}
                slotProps={{
                  field: { clearable: true, onClear: () => setStartDate('') },
                }}
                sx={{ maxWidth: 180 }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate ? dayjs(endDate) : null}
                onChange={handleEndDateChange}
                slotProps={{
                  field: { clearable: true, onClear: () => setEndDate('') },
                }}
                sx={{ maxWidth: 180 }}
              />
            </LocalizationProvider>
          </div>

          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Error State */}
          {error && !isLoading && <ErrorState />}

          {/* Empty State - No requests at all */}
          {!isLoading && !error && !hasData && !hasFiltersApplied && <EmptyState />}

          {/* No Results State - Filters applied but no results */}
          {!isLoading && !error && !hasData && hasFiltersApplied && <NoResultsState />}

          {/* Request List */}
          {!isLoading && !error && hasData && (
            <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {data.map(request => (
                <Bill
                  // Basic information
                  name={request?.itemName}
                  description={request?.description}
                  user={request?.user?.firstName}
                  userLastname={request?.user?.surname}
                  requestDepartment={request?.requestDepartment?.name}
                  requestRole={request?.role?.name}
                  amount={request?.amount}
                  status={request?.finalStatus}
                  
                  // Approval statuses
                  accountStatus={request?.accountStatus}
                  cfoApprovalStatus={request?.cfoApprovalStatus}
                  hodApprovalStatus={request?.hodApprovalStatus}
                  cooApprovalStatus={request?.cooApprovalStatus}
                  mdApprovalStatus={request?.mdApprovalStatus}
                  
                  // Dates
                  dateNeeded={request?.dateNeeded}
                  createdAt={request?.createdAt}
                  expectedDeliveryDate={request?.expectedDeliveryDate}
                  startDate={request?.startDate}
                  endDate={request?.endDate}
                  
                  // Additional fields
                  requestType={request?.requestType}
                  quantity={request?.quantity}
                  preferredVendor={request?.preferredVendor}
                  justification={request?.justification}
                  paymentMethod={request?.paymentMethod}
                  urgencyLevel={request?.urgencyLevel}
                  location={request?.location}
                  leaveType={request?.leaveType}
                  employeeName={request?.employeeName}
                  supervisorName={request?.supervisorName}
                  deviceName={request?.deviceName}
                  issueTitle={request?.issueTitle}
                  reason={request?.reason}
                  
                  // Actions
                  comment={request?.comment}
                  onClick={() => handleClickOpen(request?.id)}
                  key={request?.id}
                  // Add approvers prop
                  approvers={request?.approvers}
                />
              ))}          
            </MDBox>
          )}
        </div>
      </MDBox>
    </Card>
    </>
  );
}

export default BillingInformation;
