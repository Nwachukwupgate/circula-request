// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

// Custom components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Transaction from "layouts/billing/components/Transaction";
import { useGetMyCircularQuery } from "api/apiSlice";
import { DateTime } from "luxon";

function Transactions() {
  const { data: circularData, isLoading, error } = useGetMyCircularQuery();

  const getStatusIcon = (createdAt) => {
    const now = DateTime.now();
    const createdDate = DateTime.fromISO(createdAt);
    const diffInDays = now.diff(createdDate, "days").days;

    if (diffInDays <= 3) {
      return { icon: "expand_less", color: "success" };
    } else if (diffInDays <= 14) {
      return { icon: "priority_high", color: "dark" };
    } else {
      return { icon: "expand_more", color: "error" };
    }
  };

  const formatDate = (date) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
  };

  if (isLoading) {
    return (
      <Card sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || !circularData || !circularData.circulars?.length) {
    return (
      <Card sx={{ p: 3, textAlign: "center" }}>
        <Icon fontSize="large" color="disabled">info</Icon>
        <MDTypography variant="body2" color="text">No circulars available</MDTypography>
      </Card>
    );
  }

  const circulars = [...circularData.circulars].sort(
    (a, b) => DateTime.fromISO(b.createdAt).toMillis() - DateTime.fromISO(a.createdAt).toMillis()
  );

  const now = DateTime.now();
  const sevenDaysAgo = now.minus({ days: 7 });

  let latestCirculars = circulars.filter(c => DateTime.fromISO(c.createdAt) >= sevenDaysAgo);

  if (latestCirculars.length === 0) {
    latestCirculars = circulars.slice(0, 3); // fallback to earliest 3
  }

  const otherCirculars = circulars.filter(c => !latestCirculars.includes(c));

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Your Circular
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <MDBox color="text" mr={0.5}>
            <Icon fontSize="small">date_range</Icon>
          </MDBox>
          <MDTypography variant="button" color="text">
            {now.toFormat("dd LLL yyyy")}
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox pt={3} pb={2} px={2}>
        <MDBox mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            Latest Circulars
          </MDTypography>
        </MDBox>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0} sx={{ listStyle: "none" }}>
          {latestCirculars.map((circular) => {
            const { icon, color } = getStatusIcon(circular.createdAt);
            return (
              <Transaction
                key={circular.id}
                color={color}
                icon={icon}
                name={circular.title}
                description={formatDate(circular.createdAt)}
                value={circular.eventName}
              />
            );
          })}
        </MDBox>

        <MDBox mt={3} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            Older Circulars
          </MDTypography>
        </MDBox>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0} sx={{ listStyle: "none" }}>
          {otherCirculars.length > 0 ? (
            otherCirculars.map((circular) => {
              const { icon, color } = getStatusIcon(circular.createdAt);
              return (
                <Transaction
                  key={circular.id}
                  color={color}
                  icon={icon}
                  name={circular.title}
                  description={formatDate(circular.createdAt)}
                  value={circular.eventName}
                />
              );
            })
          ) : (
            <MDTypography variant="body2" color="text">
              No older circulars available.
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Transactions;
