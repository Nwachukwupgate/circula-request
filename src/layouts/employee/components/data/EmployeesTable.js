// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { Phone, MapPin } from "lucide-react";

// Default avatar placeholder
const defaultAvatar = "https://ui-avatars.com/api/?background=random&color=fff&name=";

export default function data({employees}) {
  const Author = ({ image, firstName, surname, email }) => {
    const fullName = `${firstName || ''} ${surname || ''}`.trim();
    const avatarSrc = image || `${defaultAvatar}${encodeURIComponent(fullName)}`;
    
    return (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={avatarSrc} name={fullName} size="sm" />
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {fullName || 'N/A'}
          </MDTypography>
          <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
      </MDBox>
    );
  };

  const Job = ({ title, department, role }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title || role || "No Job Title"}
      </MDTypography>
      <MDTypography variant="caption">{department || "No Department"}</MDTypography>
    </MDBox>
  );

  const Contact = ({ phone, location }) => (
    <MDBox lineHeight={1} textAlign="left">
      {phone && (
        <MDBox display="flex" alignItems="center" gap={0.5}>
          <Phone size={12} />
          <MDTypography variant="caption" color="text">
            {phone}
          </MDTypography>
        </MDBox>
      )}
      {location && (
        <MDBox display="flex" alignItems="center" gap={0.5} mt={0.5}>
          <MapPin size={12} />
          <MDTypography variant="caption" color="text">
            {location}
          </MDTypography>
        </MDBox>
      )}
      {!phone && !location && (
        <MDTypography variant="caption" color="text">
          -
        </MDTypography>
      )}
    </MDBox>
  );

  const EmployeeType = ({ type }) => {
    const color = type === 'staff' ? 'info' : 'warning';
    return (
      <MDBadge 
        badgeContent={type || 'staff'} 
        color={color} 
        variant="gradient" 
        size="sm" 
      />
    );
  };

  return {
    columns: [
      { Header: "employee", accessor: "employee", width: "25%", align: "left" },
      { Header: "job info", accessor: "job", align: "left" },
      { Header: "contact", accessor: "contact", align: "left" },
      { Header: "type", accessor: "type", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: employees && employees?.employees?.map((employee) => ({
        employee: (
          <Author 
            image={employee?.profileImage} 
            firstName={employee?.firstName}
            surname={employee?.surname} 
            email={employee?.email} 
          />
        ),
        job: (
          <Job 
            title={employee?.jobTitle} 
            department={employee?.department?.name}
            role={employee?.role?.name}
          />
        ),
        contact: (
          <Contact 
            phone={employee?.phone} 
            location={employee?.location} 
          />
        ),
        type: <EmployeeType type={employee?.employeeType} />,
        status: (
          <MDBox ml={-1}>
            <MDBadge 
              badgeContent={employee?.lastActiveAt ? "active" : "offline"} 
              color={employee?.lastActiveAt ? "success" : "secondary"} 
              variant="gradient" 
              size="sm" 
            />
          </MDBox>
        ),
        action: (
          <MDTypography 
            component="a" 
            href="#" 
            variant="caption" 
            color="info" 
            fontWeight="medium"
            sx={{ cursor: 'pointer' }}
          >
            View
          </MDTypography>
        ),
    }))
  };
}
