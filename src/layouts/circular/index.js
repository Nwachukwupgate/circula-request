import { useState, useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";

import CreateCircular from "./components/Create";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useGetMyCircularQuery, useGetProfileQuery } from "api/apiSlice";
import { useNavigate } from "react-router-dom";

// Icons
import {
  Search,
  Plus,
  FileText,
  Users,
  Building2,
  Briefcase,
  Globe,
  Calendar,
  Eye,
  MessageCircle,
  Megaphone,
  Inbox,
} from "lucide-react";

// Images
import Role from "assets/images/Role.png";
import Dept from "assets/images/Dept.png";
import General from "assets/images/General.png";

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// Circular Card Component
const CircularCard = ({ circular, onClick }) => {
  const imageMap = {
    role: Role,
    department: Dept,
    company: General,
    individual: Dept,
  };

  const targetTypeConfig = {
    company: { icon: <Globe size={14} />, color: '#ef4444', label: 'Company-wide' },
    department: { icon: <Building2 size={14} />, color: '#3b82f6', label: 'Department' },
    role: { icon: <Briefcase size={14} />, color: '#8b5cf6', label: 'Role-based' },
    individual: { icon: <Users size={14} />, color: '#10b981', label: 'Individual' },
  };

  const config = targetTypeConfig[circular.targetType] || targetTypeConfig.company;

  // Strip HTML and truncate
  const plainText = circular.body?.replace(/<[^>]+>/g, '') || '';
  const description = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      {/* Header Image */}
      <MDBox
        sx={{
          height: 120,
          background: `linear-gradient(135deg, ${config.color}20 0%, ${config.color}40 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img 
          src={imageMap[circular.targetType] || General} 
          alt={circular.targetType}
          style={{ 
            width: 60, 
            height: 60, 
            objectFit: 'contain',
            opacity: 0.8 
          }}
        />
        <Chip
          icon={config.icon}
          label={config.label}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'white',
            color: config.color,
            fontWeight: 600,
            fontSize: '0.7rem',
            '& .MuiChip-icon': { color: config.color }
          }}
        />
      </MDBox>

      {/* Content */}
      <MDBox p={2.5} flex={1} display="flex" flexDirection="column">
        <MDTypography variant="h6" fontWeight="bold" mb={1} sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {circular.title}
        </MDTypography>
        
        {circular.eventName && (
          <MDTypography variant="caption" color="info" fontWeight="medium" mb={1}>
            📅 {circular.eventName}
          </MDTypography>
        )}

        <MDTypography 
          variant="body2" 
          color="text" 
          mb={2}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            flex: 1,
          }}
        >
          {description}
        </MDTypography>

        {/* Footer */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mt="auto">
          <MDBox display="flex" alignItems="center" gap={0.5}>
            <Calendar size={14} color="#9e9e9e" />
            <MDTypography variant="caption" color="text">
              {formatDate(circular.createdAt)}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" gap={1.5}>
            {circular.responseCount > 0 && (
              <Tooltip title={`${circular.responseCount} responses`}>
                <MDBox display="flex" alignItems="center" gap={0.5}>
                  <MessageCircle size={14} color="#667eea" />
                  <MDTypography variant="caption" color="info" fontWeight="medium">
                    {circular.responseCount}
                  </MDTypography>
                </MDBox>
              </Tooltip>
            )}
            <MDTypography variant="caption" color="info" fontWeight="medium">
              View →
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ hasFilters, onClearFilters, onCreateCircular }) => (
  <MDBox
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={10}
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
        mb: 3,
      }}
    >
      {hasFilters ? <Search size={50} color="#9e9e9e" /> : <Inbox size={50} color="#9e9e9e" />}
    </MDBox>
    <MDTypography variant="h5" fontWeight="medium" mb={1}>
      {hasFilters ? 'No Circulars Found' : 'No Circulars Yet'}
    </MDTypography>
    <MDTypography variant="body2" color="text" textAlign="center" mb={3} sx={{ maxWidth: 400 }}>
      {hasFilters
        ? 'No circulars match your search criteria. Try adjusting your filters.'
        : 'Circulars are announcements shared across your organization. Create the first one to get started!'}
    </MDTypography>
    {hasFilters ? (
      <MDButton variant="outlined" color="info" onClick={onClearFilters}>
        Clear Filters
      </MDButton>
    ) : (
      <MDButton variant="gradient" color="info" onClick={onCreateCircular}>
        <Plus size={18} style={{ marginRight: 8 }} />
        Create First Circular
      </MDButton>
    )}
  </MDBox>
);

function Circular() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  const { data: circularsData, isLoading, error } = useGetMyCircularQuery();
  const { data: profile } = useGetProfileQuery();

  const circulars = circularsData?.circulars || [];

  // Filter circulars based on search and tab
  const filteredCirculars = useMemo(() => {
    let filtered = [...circulars];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(query) ||
        c.body?.toLowerCase().includes(query) ||
        c.eventName?.toLowerCase().includes(query)
      );
    }

    // Tab filter
    const tabFilters = ['all', 'company', 'department', 'role', 'individual'];
    if (activeTab > 0) {
      filtered = filtered.filter(c => c.targetType === tabFilters[activeTab]);
    }

    return filtered;
  }, [circulars, searchQuery, activeTab]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCircularClick = (id) => {
    navigate(`/circulars/${id}`);
  };

  // Stats
  const stats = useMemo(() => ({
    total: circulars.length,
    company: circulars.filter(c => c.targetType === 'company').length,
    department: circulars.filter(c => c.targetType === 'department').length,
    role: circulars.filter(c => c.targetType === 'role').length,
  }), [circulars]);

  const hasFilters = searchQuery || activeTab > 0;

  return (
    <>
      <CreateCircular open={open} handleClose={handleClose} />

      <DashboardLayout>
        <DashboardNavbar />
        
        <MDBox py={3}>
          {/* Header Section */}
          <MDBox mb={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                overflow: 'visible',
              }}
            >
              <MDBox p={3}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} md={8}>
                    <MDBox display="flex" alignItems="center" gap={2} mb={2}>
                      <Megaphone size={32} color="white" />
                      <MDTypography variant="h4" color="white" fontWeight="bold">
                        Company Circulars
                      </MDTypography>
                    </MDBox>
                    <MDTypography variant="body2" color="white" opacity={0.9}>
                      Stay informed with the latest announcements, updates, and communications from your organization.
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MDBox display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={2} flexWrap="wrap">
                      <MDBox textAlign="center" px={2}>
                        <MDTypography variant="h3" color="white" fontWeight="bold">
                          {stats.total}
                        </MDTypography>
                        <MDTypography variant="caption" color="white" opacity={0.8}>
                          Total
                        </MDTypography>
                      </MDBox>
                      <MDBox textAlign="center" px={2}>
                        <MDTypography variant="h3" color="white" fontWeight="bold">
                          {stats.company}
                        </MDTypography>
                        <MDTypography variant="caption" color="white" opacity={0.8}>
                          Company-wide
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </MDBox>

          {/* Filters Section */}
          <MDBox mb={3}>
            <Card>
              <MDBox p={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search circulars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={18} color="#9e9e9e" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Tabs
                      value={activeTab}
                      onChange={(e, v) => setActiveTab(v)}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        '& .MuiTab-root': {
                          minHeight: 40,
                          textTransform: 'none',
                          fontWeight: 500,
                        },
                      }}
                    >
                      <Tab label="All" icon={<FileText size={16} />} iconPosition="start" />
                      <Tab label="Company" icon={<Globe size={16} />} iconPosition="start" />
                      <Tab label="Department" icon={<Building2 size={16} />} iconPosition="start" />
                      <Tab label="Role" icon={<Briefcase size={16} />} iconPosition="start" />
                      <Tab label="Individual" icon={<Users size={16} />} iconPosition="start" />
                    </Tabs>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </MDBox>

          {/* Content */}
          {isLoading ? (
            <MDBox display="flex" justifyContent="center" alignItems="center" py={10}>
              <CircularProgress size={48} />
            </MDBox>
          ) : error ? (
            <Card>
              <MDBox p={4} textAlign="center">
                <MDTypography variant="h6" color="error">
                  Failed to load circulars
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Please try again later.
                </MDTypography>
              </MDBox>
            </Card>
          ) : filteredCirculars.length === 0 ? (
            <Card>
              <EmptyState
                hasFilters={hasFilters}
                onClearFilters={() => {
                  setSearchQuery('');
                  setActiveTab(0);
                }}
                onCreateCircular={handleClickOpen}
              />
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredCirculars.map((circular) => (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={circular.id}>
                  <CircularCard
                    circular={circular}
                    onClick={() => handleCircularClick(circular.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </MDBox>

        <Footer />

        {/* Floating Action Button */}
        <Tooltip title="Create New Circular" placement="left">
          <Fab
            color="primary"
            aria-label="create circular"
            onClick={handleClickOpen}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
              width: 60,
              height: 60,
            }}
          >
            <Plus size={28} />
          </Fab>
        </Tooltip>
      </DashboardLayout>
    </>
  );
}

export default Circular;
