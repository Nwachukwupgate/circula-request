import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "api/apiSlice";
import { toast } from 'react-toastify';

function PlatformSettings() {
  const { data: settingsData, isLoading } = useGetUserSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateUserSettingsMutation();
  
  const [localSettings, setLocalSettings] = useState({
    emailOnCircular: true,
    emailOnRequest: true,
    emailOnKpiAssigned: true,
    emailOnKpiReminder: true,
    emailOnFeedback: true,
    pushNotifications: true,
    weeklyDigest: false,
    darkMode: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData?.settings) {
      setLocalSettings(settingsData.settings);
    }
  }, [settingsData]);

  const handleToggle = (key) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      setHasChanges(true);
      return newSettings;
    });
  };

  const handleSave = async () => {
    try {
      await updateSettings(localSettings).unwrap();
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card sx={{ boxShadow: "none", p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Card>
    );
  }

  const SettingItem = ({ label, checked, onChange, description }) => (
    <MDBox display="flex" alignItems="flex-start" mb={1.5} ml={-1.5}>
      <MDBox mt={0.5}>
        <Switch checked={checked} onChange={onChange} />
      </MDBox>
      <MDBox ml={0.5}>
        <MDTypography variant="button" fontWeight="regular" color="text">
          {label}
        </MDTypography>
        {description && (
          <MDTypography variant="caption" color="text" display="block" sx={{ opacity: 0.7, mt: -0.5 }}>
            {description}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Notification Settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        {/* Email Notifications */}
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Email Notifications
        </MDTypography>
        
        <SettingItem
          label="New Circulars"
          checked={localSettings.emailOnCircular}
          onChange={() => handleToggle('emailOnCircular')}
          description="Get notified when new circulars are published"
        />
        
        <SettingItem
          label="Request Updates"
          checked={localSettings.emailOnRequest}
          onChange={() => handleToggle('emailOnRequest')}
          description="Notifications for request approvals and rejections"
        />
        
        <SettingItem
          label="KPI Assignments"
          checked={localSettings.emailOnKpiAssigned}
          onChange={() => handleToggle('emailOnKpiAssigned')}
          description="When new KPIs are assigned to you"
        />
        
        <SettingItem
          label="KPI Reminders"
          checked={localSettings.emailOnKpiReminder}
          onChange={() => handleToggle('emailOnKpiReminder')}
          description="Deadline reminders for your KPIs"
        />
        
        <SettingItem
          label="Feedback & Reviews"
          checked={localSettings.emailOnFeedback}
          onChange={() => handleToggle('emailOnFeedback')}
          description="When managers provide feedback on your work"
        />

        <Divider sx={{ my: 2 }} />

        {/* Application Settings */}
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Application
        </MDTypography>
        
        <SettingItem
          label="Push Notifications"
          checked={localSettings.pushNotifications}
          onChange={() => handleToggle('pushNotifications')}
          description="In-app notification alerts"
        />
        
        <SettingItem
          label="Weekly Digest"
          checked={localSettings.weeklyDigest}
          onChange={() => handleToggle('weeklyDigest')}
          description="Weekly summary of your activities and KPIs"
        />
        
        <SettingItem
          label="Dark Mode"
          checked={localSettings.darkMode}
          onChange={() => handleToggle('darkMode')}
          description="Use dark theme across the application"
        />

        {/* Save Button */}
        {hasChanges && (
          <MDBox mt={3}>
            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
