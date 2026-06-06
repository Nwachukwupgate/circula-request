import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

import { useGetProfileQuery, useGetMyCircularQuery, useUpdateProfileMutation } from "api/apiSlice";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import SubscriptionManagement from "components/Subscription/SubscriptionManagement";

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Edit Profile Modal Component
function EditProfileModal({ open, onClose, data, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    firstName: data?.firstName || '',
    surname: data?.surname || '',
    phone: data?.phone || '',
    bio: data?.bio || '',
    location: data?.location || '',
    jobTitle: data?.jobTitle || ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <MDBox
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDTypography variant="h5" fontWeight="bold">
            Edit Profile
          </MDTypography>
          <IconButton onClick={onClose} size="small">
            <Icon>close</Icon>
          </IconButton>
        </MDBox>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              variant="outlined"
              size="small"
              placeholder="e.g. Senior Developer"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              size="small"
              placeholder="+234..."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              variant="outlined"
              size="small"
              placeholder="e.g. Lagos, Nigeria"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </Grid>
        </Grid>

        <MDBox mt={3} display="flex" gap={2} justifyContent="flex-end">
          <MDButton variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </MDButton>
          <MDButton 
            variant="gradient" 
            color="info" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </MDButton>
        </MDBox>
      </MDBox>
    </Modal>
  );
}

// Recent Circulars Component
function RecentCirculars({ circularsData, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card sx={{ height: "100%", boxShadow: "none" }}>
        <MDBox p={2}>
          <MDTypography variant="h6" fontWeight="medium">
            Recent Circulars
          </MDTypography>
        </MDBox>
        <MDBox p={2} display="flex" justifyContent="center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </MDBox>
      </Card>
    );
  }

  // Handle both array and object responses
  const circulars = Array.isArray(circularsData) ? circularsData : circularsData?.circulars || [];
  const displayCirculars = circulars.slice(0, 5);

  return (
    <Card sx={{ height: "100%", boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Recent Circulars
        </MDTypography>
        <MDTypography variant="caption" color="text">
          Latest updates from your organization
        </MDTypography>
      </MDBox>
      <MDBox px={2} pb={2}>
        {displayCirculars.length === 0 ? (
          <MDBox textAlign="center" py={3}>
            <Icon sx={{ fontSize: 40, color: 'grey.400', mb: 1 }}>inbox</Icon>
            <MDTypography variant="body2" color="text">
              No circulars yet
            </MDTypography>
          </MDBox>
        ) : (
          displayCirculars.map((circular, index) => (
            <MDBox key={circular.id}>
              <MDBox
                display="flex"
                alignItems="flex-start"
                py={1.5}
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: 'grey.100' },
                  px: 1
                }}
                onClick={() => navigate(`/circulars/${circular.id}`)}
              >
                <MDBox
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                    mr: 1.5
                  }}
                >
                  <Icon fontSize="small">campaign</Icon>
                </MDBox>
                <MDBox flex={1} minWidth={0}>
                  <MDTypography 
                    variant="button" 
                    fontWeight="medium"
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {circular.title}
                  </MDTypography>
                  <MDTypography 
                    variant="caption" 
                    color="text"
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {circular.body?.replace(/<[^>]*>/g, '').substring(0, 80)}...
                  </MDTypography>
                  <MDTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
                    {formatDate(circular.createdAt)}
                  </MDTypography>
                </MDBox>
              </MDBox>
              {index < displayCirculars.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </MDBox>
          ))
        )}
        
        {circulars.length > 5 && (
          <MDBox textAlign="center" mt={2}>
            <MDButton 
              variant="text" 
              color="info" 
              size="small"
              onClick={() => navigate('/circulars')}
            >
              View All Circulars
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

function Overview() {
  const { data, isLoading, refetch } = useGetProfileQuery();
  const { data: circularsData, isLoading: circularsLoading } = useGetMyCircularQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (formData) => {
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  // Generate profile description based on role
  const getProfileDescription = () => {
    if (data?.bio) return data.bio;
    
    const roleName = data?.role?.name?.toLowerCase();
    const name = `${data?.surname || ''} ${data?.firstName || ''}`;
    
    const descriptions = {
      md: `Hi, I'm ${name}, the Managing Director of Internalops Pro. As the MD, I oversee all operations within the company, ensuring strategic alignment and efficient management of resources.`,
      coo: `Hi, I'm ${name}, the Chief Operating Officer at Internalops Pro. I focus on optimizing our day-to-day operations and ensuring all departments run efficiently.`,
      cto: `Hi, I'm ${name}, the Chief Technology Officer at Internalops Pro. I am responsible for the company's technological direction and innovation.`,
      hod: `Hi, I'm ${name}, Head of Department at Internalops Pro. I lead my team to achieve departmental goals while supporting organizational objectives.`,
      ict: `Hi, I'm ${name}, part of the ICT team at Internalops Pro. My role involves managing IT infrastructure and ensuring seamless operations.`,
    };
    
    return descriptions[roleName] || `Hi, I'm ${name}, a dedicated team member at Internalops Pro, contributing to the success of our organization.`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile data...</p>
          </div>
        </div>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {data?.isCompanyAdmin && data?.companyId && (
        <MDBox px={3} mb={2}>
          <SubscriptionManagement
            companyId={data.companyId}
            isCompanyAdmin={data.isCompanyAdmin}
          />
        </MDBox>
      )}
      <Header data={data} onEditProfile={handleEditProfile}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Profile Information"
                description={getProfileDescription()}
                info={{
                  fullName: `${data?.surname || ''} ${data?.firstName || ''}`,
                  email: data?.email || '',
                  phone: data?.phone || 'Not set',
                  location: data?.location || 'Not set',
                  department: data?.department?.name || 'N/A',
                  role: data?.role?.name || 'N/A',
                  memberSince: formatDate(data?.createdAt)
                }}
                social={[
                  {
                    link: "#",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "#",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "#",
                    icon: <LinkedInIcon />,
                    color: "linkedin",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile", onClick: handleEditProfile }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <RecentCirculars 
                circularsData={circularsData} 
                isLoading={circularsLoading} 
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        data={data}
        onSave={handleSaveProfile}
        isLoading={isUpdating}
      />
      
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
