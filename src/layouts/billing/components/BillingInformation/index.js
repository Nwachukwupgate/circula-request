import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import MDButton from '@mui/material/Button';

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

import { useGetRequestQuery, useGetProfileQuery } from "api/apiSlice";

function BillingInformation() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null)
  const [cleared, setCleared] = useState(false);
  
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
          <div className="flex flex-col lg:flex-row gap-6"> 
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
                label="start Date"
                value={startDate ? dayjs(startDate) : null}
                onChange={handleDateChange}
                slotProps={{
                  field: { clearable: true, onClear: () => setCleared(true) },
                }}
                required
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate ? dayjs(endDate) : null}
                onChange={handleEndDateChange}
                slotProps={{
                  field: { clearable: true, onClear: () => setCleared(true) },
                }}
                required
              />
            </LocalizationProvider>
          </div>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {data && data.map(request => (
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
        </div>
      </MDBox>
    </Card>
    </>
  );
}

export default BillingInformation;
