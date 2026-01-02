import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import breakpoints from "assets/theme/base/breakpoints";
import { useUploadProfileImageMutation } from "api/apiSlice";
import { toast } from 'react-toastify';

// Images
import backgroundImage from "assets/images/bg-profile.jpeg";

// Default avatar with initials
const getInitials = (firstName, surname) => {
  return `${firstName?.[0] || ''}${surname?.[0] || ''}`.toUpperCase();
};

function Header({ children, data, onEditProfile }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);
  
  const [uploadProfileImage, { isLoading: isUploading }] = useUploadProfileImageMutation();

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await uploadProfileImage({ image: reader.result }).unwrap();
        toast.success('Profile image updated successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
        console.error('Upload error:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate avatar content
  const renderAvatar = () => {
    if (data?.profileImage) {
      return (
        <MDAvatar 
          src={data.profileImage} 
          alt="profile-image" 
          size="xl" 
          shadow="sm"
          sx={{ 
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
      );
    }

    // Fallback to initials avatar
    const initials = getInitials(data?.firstName, data?.surname);
    return (
      <MDBox
        sx={{
          width: 74,
          height: 74,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          '&:hover': { transform: 'scale(1.05)' }
        }}
      >
        {initials}
      </MDBox>
    );
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            {/* Profile Image with Upload */}
            <MDBox
              position="relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleImageClick}
              sx={{ cursor: 'pointer' }}
            >
              {isUploading ? (
                <MDBox
                  sx={{
                    width: 74,
                    height: 74,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.200'
                  }}
                >
                  <CircularProgress size={30} />
                </MDBox>
              ) : (
                renderAvatar()
              )}
              
              {/* Hover overlay */}
              {isHovering && !isUploading && (
                <MDBox
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 74,
                    height: 74,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Icon>camera_alt</Icon>
                </MDBox>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </MDBox>
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  {`${data?.surname || ''} ${data?.firstName || ''}`}
                </MDTypography>
                {onEditProfile && (
                  <Tooltip title="Edit Profile">
                    <IconButton size="small" onClick={onEditProfile}>
                      <Icon fontSize="small">edit</Icon>
                    </IconButton>
                  </Tooltip>
                )}
              </MDBox>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {data?.jobTitle || `${data?.department?.name || ''} / ${data?.role?.name || ''}`}
              </MDTypography>
              {data?.location && (
                <MDTypography variant="caption" color="text" display="block">
                  📍 {data.location}
                </MDTypography>
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Overview"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      person
                    </Icon>
                  }
                />
                <Tab
                  label="Activity"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      history
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = {
  children: "",
  onEditProfile: null,
};

Header.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  onEditProfile: PropTypes.func,
};

export default Header;
