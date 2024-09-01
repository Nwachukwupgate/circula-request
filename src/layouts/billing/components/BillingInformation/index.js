import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Bill from "layouts/billing/components/Bill";
import DraggableDialog from "../Bill/BillDetails";

import { useGetRequestQuery } from "api/apiSlice";

function BillingInformation() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null)
  console.log("id", id);
  
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data , error, isLoading } = useGetRequestQuery({
    filter: filter === 'all' ? undefined : filter,
    startDate: filter === 'dateRange' ? startDate : undefined,
    endDate: filter === 'dateRange' ? endDate : undefined,
  });

  const handleClickOpen = (id) => {
    console.log("Clicked id:", id)
    setId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <DraggableDialog open={open} onClose={handleClose} id={id} />

    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Request Information
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <div className="cursor-pointer">
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {data && data.map(request => (
              <Bill
                name={request?.itemName}
                description={request?.itemDescription}
                user={request?.userId}
                amount={request?.amount}
                status={request?.status}
                onClick={() => handleClickOpen(request?.id)}
                key={request?.id}
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
