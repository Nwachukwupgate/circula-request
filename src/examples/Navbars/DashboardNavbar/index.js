
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// API hooks
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useClearReadNotificationsMutation,
  useGetProfileQuery,
  useLogoutMutation
} from "api/apiSlice";

import { clearTokens } from "utils/tokenManager";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Icons for notification types
const getNotificationIcon = (type) => {
  const icons = {
    circular_published: "campaign",
    request_submitted: "assignment",
    request_approved: "check_circle",
    request_rejected: "cancel",
    kpi_assigned: "track_changes",
    kpi_report_submitted: "assessment",
    kpi_feedback_received: "feedback",
    kpi_reminder: "alarm",
    kpi_overdue: "warning",
    feedback_request: "question_answer",
    feedback_reply: "reply",
    ai_insight: "psychology",
    milestone_set: "flag",
    system: "info"
  };
  return icons[type] || "notifications";
};

const getNotificationColor = (type, priority) => {
  if (priority === 'urgent') return '#dc2626';
  if (priority === 'high') return '#f59e0b';
  
  const colors = {
    circular_published: '#3b82f6',
    request_submitted: '#8b5cf6',
    request_approved: '#10b981',
    request_rejected: '#ef4444',
    kpi_assigned: '#6366f1',
    kpi_report_submitted: '#06b6d4',
    kpi_feedback_received: '#14b8a6',
    kpi_reminder: '#f59e0b',
    kpi_overdue: '#ef4444',
    feedback_request: '#8b5cf6',
    feedback_reply: '#10b981',
    ai_insight: '#a855f7',
    milestone_set: '#22c55e',
    system: '#6b7280'
  };
  return colors[type] || '#6b7280';
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(null);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  // Profile and auth hooks
  const { data: profile } = useGetProfileQuery();
  const [logout] = useLogoutMutation();

  // Notification API hooks
  const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery({ limit: 10 });
  const { data: unreadCountData } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 30000 // Poll every 30 seconds
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [clearRead] = useClearReadNotificationsMutation();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = unreadCountData?.unreadCount || 0;

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
    refetch(); // Refresh notifications when opening
  };
  const handleCloseMenu = () => setOpenMenu(false);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    handleCloseMenu();
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const handleClearRead = async () => {
    await clearRead();
    refetch();
  };

  // Profile menu handlers
  const handleOpenProfileMenu = (event) => setProfileMenu(event.currentTarget);
  const handleCloseProfileMenu = () => setProfileMenu(null);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      handleCloseProfileMenu();
      navigate('/authentication/sign-in');
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    return profile?.firstName?.[0]?.toUpperCase() || 'U';
  };

  // Render profile dropdown menu
  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenu}
      open={Boolean(profileMenu)}
      onClose={handleCloseProfileMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        mt: 1,
        "& .MuiMenu-paper": {
          minWidth: 220,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* User Info Header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
        <MDTypography variant="button" fontWeight="medium" display="block">
          {profile?.firstName} {profile?.lastName}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {profile?.email}
        </MDTypography>
      </Box>

      {/* Menu Items */}
      <Box sx={{ py: 1 }}>
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
          onClick={() => {
            handleCloseProfileMenu();
            navigate('/profile');
          }}
        >
          <Icon sx={{ color: '#666', fontSize: 20 }}>person</Icon>
          <MDTypography variant="button" fontWeight="regular">
            My Profile
          </MDTypography>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
          onClick={() => {
            handleCloseProfileMenu();
            navigate('/notification');
          }}
        >
          <Icon sx={{ color: '#666', fontSize: 20 }}>notifications</Icon>
          <MDTypography variant="button" fontWeight="regular">
            Notifications
          </MDTypography>
          {unreadCount > 0 && (
            <Box
              sx={{
                ml: 'auto',
                bgcolor: '#ef4444',
                color: 'white',
                borderRadius: '10px',
                px: 1,
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
          onClick={() => {
            handleCloseProfileMenu();
            navigate('/help-center');
          }}
        >
          <Icon sx={{ color: '#666', fontSize: 20 }}>help_outline</Icon>
          <MDTypography variant="button" fontWeight="regular">
            Help Center
          </MDTypography>
        </Box>
      </Box>

      {/* Logout */}
      <Box sx={{ borderTop: '1px solid #f0f0f0', py: 1 }}>
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#fff5f5' },
          }}
          onClick={handleLogout}
        >
          <Icon sx={{ color: '#dc2626', fontSize: 20 }}>logout</Icon>
          <MDTypography variant="button" fontWeight="regular" sx={{ color: '#dc2626' }}>
            Log Out
          </MDTypography>
        </Box>
      </Box>
    </Menu>
  );

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ 
        mt: 2,
        "& .MuiPaper-root": {
          width: 380,
          maxHeight: 480,
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px 8px 0 0'
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {unreadCount} unread
            </Typography>
          )}
        </Box>
        {unreadCount > 0 && (
          <Tooltip title="Mark all as read">
            <IconButton 
              size="small" 
              onClick={handleMarkAllRead}
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <Icon fontSize="small">done_all</Icon>
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: 340, overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Icon sx={{ fontSize: 48, color: '#d1d5db', mb: 1 }}>notifications_none</Icon>
            <Typography variant="body2" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((notification, index) => (
            <Box key={notification.id}>
              <Box
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: notification.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                  },
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                {/* Unread indicator */}
                {!notification.isRead && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#6366f1'
                    }}
                  />
                )}
                
                {/* Icon */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${getNotificationColor(notification.type, notification.priority)}15`,
                    color: getNotificationColor(notification.type, notification.priority),
                    flexShrink: 0,
                    ml: 1
                  }}
                >
                  <Icon fontSize="small">{getNotificationIcon(notification.type)}</Icon>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: notification.isRead ? 500 : 600,
                      color: '#1f2937',
                      mb: 0.25,
                      lineHeight: 1.3
                    }}
                  >
                    {notification.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280',
                      fontSize: '0.8rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#9ca3af',
                      fontSize: '0.7rem',
                      mt: 0.5,
                      display: 'block'
                    }}
                  >
                    {formatTimeAgo(notification.createdAt)}
                  </Typography>
                </Box>

                {/* Priority indicator */}
                {(notification.priority === 'urgent' || notification.priority === 'high') && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: notification.priority === 'urgent' ? '#ef4444' : '#f59e0b',
                      flexShrink: 0
                    }}
                  />
                )}
              </Box>
              {index < notifications.length - 1 && <Divider sx={{ mx: 2 }} />}
            </Box>
          ))
        )}
      </Box>

      {/* Footer */}
      {notifications.length > 0 && (
        <Box sx={{ 
          p: 1.5, 
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography
            component={Link}
            to="/notification"
            onClick={handleCloseMenu}
            sx={{
              fontSize: '0.8rem',
              color: '#6366f1',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            View all notifications
          </Typography>
          <Tooltip title="Clear read notifications">
            <IconButton 
              size="small" 
              onClick={handleClearRead}
              sx={{ color: '#9ca3af', '&:hover': { color: '#ef4444' } }}
            >
              <Icon fontSize="small">delete_sweep</Icon>
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
          {!isMini && (
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
          )}
          <MDBox color={light ? "white" : "inherit"}>
            {!isMini && (
              <>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleConfiguratorOpen}
                >
                  <Icon sx={iconsStyle}>settings</Icon>
                </IconButton>
                <Tooltip title="Help Center">
                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarIconButton}
                    onClick={() => navigate('/help-center')}
                  >
                    <Icon sx={iconsStyle}>help_outline</Icon>
                  </IconButton>
                </Tooltip>
              </>
            )}
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              aria-controls="notification-menu"
              aria-haspopup="true"
              variant="contained"
              onClick={handleOpenMenu}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                max={99}
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: '0.65rem',
                    height: 18,
                    minWidth: 18,
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  }
                }}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </Badge>
            </IconButton>
            {renderMenu()}
            
            {/* Profile Avatar & Dropdown */}
            <Tooltip title="Account">
              <IconButton
                size="small"
                disableRipple
                sx={{ 
                  ...navbarIconButton,
                  ml: 1,
                  p: 0.5,
                }}
                onClick={handleOpenProfileMenu}
              >
                {profile?.profileImage ? (
                  <MDAvatar
                    src={profile.profileImage}
                    alt={profile?.firstName || 'User'}
                    size="sm"
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                    }}
                  >
                    {getUserInitials()}
                  </Box>
                )}
              </IconButton>
            </Tooltip>
            {renderProfileMenu()}
          </MDBox>
        </MDBox>
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
