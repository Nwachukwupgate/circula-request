import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import ContactSupportPanel from "components/Support/ContactSupportPanel";
import {
  Card,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  ChevronDown,
  FileText,
  Target,
  Bell,
  User,
  HelpCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: <HelpCircle size={18} /> },
    { id: 'requests', label: 'Requests', icon: <FileText size={18} /> },
    { id: 'kpi', label: 'KPIs', icon: <Target size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  const quickGuides = [
    {
      title: 'Submit Your First Request',
      description: 'Learn how to create and submit different types of requests',
      icon: <FileText size={24} />,
      color: '#4CAF50',
      route: '/billing',
      steps: [
        'Navigate to the "Requests" page from the sidebar',
        'Click the "Make Request" button',
        'Select your request type (Procurement, Leave, IT, etc.)',
        'Fill in the required details and submit',
        'Track your request status on the dashboard'
      ]
    },
    {
      title: 'Track Your KPI Progress',
      description: 'View assigned KPIs and submit progress reports',
      icon: <Target size={24} />,
      color: '#9C27B0',
      route: '/kpi',
      steps: [
        'Go to "My KPIs" from the KPI menu',
        'View all your assigned KPIs and their status',
        'Click on a KPI to see details',
        'Use "Submit Report" to update your progress',
        'Check AI insights for improvement tips'
      ]
    },
    {
      title: 'Manage Notifications',
      description: 'Stay updated and customize your notification preferences',
      icon: <Bell size={24} />,
      color: '#FF9800',
      route: '/notifications',
      steps: [
        'Click the bell icon in the navigation bar',
        'View recent notifications in the dropdown',
        'Click "View All" for full notification history',
        'Go to Profile > Settings to customize preferences',
        'Toggle email and push notifications as needed'
      ]
    },
    {
      title: 'Update Your Profile',
      description: 'Personalize your account and settings',
      icon: <User size={24} />,
      color: '#2196F3',
      route: '/profile',
      steps: [
        'Click your avatar or go to "Profile" page',
        'Click on the camera icon to upload a photo',
        'Edit your bio, phone, and location',
        'Adjust notification settings',
        'Save your changes'
      ]
    },
  ];

  const faqs = [
    {
      category: 'requests',
      question: 'How do I submit a new request?',
      answer: 'Navigate to the Requests page and click "Make Request". Select your request type, fill in the details, and submit. Your request will be routed to the appropriate approvers automatically.'
    },
    {
      category: 'requests',
      question: 'How can I track my request status?',
      answer: 'You can track your requests from the Requests page. Each request shows its current status (Pending, Approved, Rejected) and which approver it\'s with. You\'ll also receive notifications when the status changes.'
    },
    {
      category: 'requests',
      question: 'What happens if my request is rejected?',
      answer: 'If rejected, you\'ll receive a notification with the reason. You can view the rejection comment in the request details. Depending on the feedback, you may submit a new request with the necessary corrections.'
    },
    {
      category: 'requests',
      question: 'Can I edit a submitted request?',
      answer: 'Requests that are still in "Draft" status can be edited. Once submitted and in the approval workflow, requests cannot be modified. You would need to contact the current approver or submit a new request.'
    },
    {
      category: 'kpi',
      question: 'How do I submit a KPI progress report?',
      answer: 'Go to My KPIs, click on the specific KPI, then click "Submit Report". Enter your achieved value, add any notes, and optionally attach supporting documents. Your progress percentage will update automatically.'
    },
    {
      category: 'kpi',
      question: 'What do the KPI priority levels mean?',
      answer: 'Priority levels indicate importance: Low (nice to have), Medium (important), High (critical for role), Critical (urgent business need). Focus on higher priority KPIs first to ensure key objectives are met.'
    },
    {
      category: 'kpi',
      question: 'How does the AI insight feature work?',
      answer: 'Our AI analyzes your KPI progress, compares it to targets and deadlines, and provides personalized suggestions. It identifies at-risk KPIs and recommends actions to get back on track. Check your dashboard for daily AI reminders.'
    },
    {
      category: 'kpi',
      question: 'Can I request feedback from my manager on a KPI?',
      answer: 'Yes! On the KPI details page, click "Request Feedback" to send a message to your manager asking for guidance. They\'ll receive a notification and can respond directly through the system.'
    },
    {
      category: 'notifications',
      question: 'How do I turn off email notifications?',
      answer: 'Go to Profile > Settings. Under "Email Notifications", toggle off the types you don\'t want to receive via email. You\'ll still see these notifications in-app unless you turn those off too.'
    },
    {
      category: 'notifications',
      question: 'Why am I not receiving notifications?',
      answer: 'Check your notification settings in Profile > Settings. Ensure the relevant notification types are enabled. Also check your spam folder for emails. If issues persist, contact your administrator.'
    },
    {
      category: 'profile',
      question: 'How do I change my profile picture?',
      answer: 'Go to your Profile page and hover over your avatar. Click the camera icon that appears, select an image file, and it will upload automatically. Supported formats: JPG, PNG, GIF (max 5MB).'
    },
    {
      category: 'profile',
      question: 'Can I change my email address?',
      answer: 'Email addresses are managed by your organization\'s administrator. Contact your HR or IT department to request an email change. This ensures proper access control and audit trails.'
    },
    {
      category: 'profile',
      question: 'How do I reset my password?',
      answer: 'On the login page, click "Forgot Password". Enter your email address and you\'ll receive a reset link. Click the link and enter your new password. The link expires after 1 hour for security.'
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const handleRestartTour = () => {
    localStorage.removeItem('circula_onboarding_completed');
    localStorage.removeItem('circula_onboarding_step');
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Header */}
        <MDBox 
          mb={4} 
          textAlign="center"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            py: 5,
            px: 3,
            color: 'white'
          }}
        >
          <MDTypography variant="h3" color="white" fontWeight="bold" mb={1}>
            Help Center
          </MDTypography>
          <MDTypography variant="body1" color="white" opacity={0.9} mb={3}>
            Find answers, learn features, and get the most out of Circula-Request
          </MDTypography>
          
          {/* Search */}
          <MDBox maxWidth={500} mx="auto">
            <TextField
              fullWidth
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#666" />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& fieldset': { border: 'none' }
                }
              }}
            />
          </MDBox>
        </MDBox>

        {/* Restart Tour Button */}
        <MDBox display="flex" justifyContent="flex-end" mb={3}>
          <MDButton
            variant="outlined"
            color="info"
            size="small"
            onClick={handleRestartTour}
            startIcon={<RefreshCw size={16} />}
          >
            Restart Onboarding Tour
          </MDButton>
        </MDBox>

        {/* Quick Start Guides */}
        <MDBox mb={5}>
          <MDTypography variant="h5" fontWeight="medium" mb={3}>
            Quick Start Guides
          </MDTypography>
          <Grid container spacing={3}>
            {quickGuides.map((guide, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate(guide.route)}
                >
                  <MDBox p={3}>
                    <MDBox 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `${guide.color}15`,
                        color: guide.color,
                        mb: 2
                      }}
                    >
                      {guide.icon}
                    </MDBox>
                    <MDTypography variant="h6" fontWeight="medium" mb={1}>
                      {guide.title}
                    </MDTypography>
                    <MDTypography variant="body2" color="text" mb={2}>
                      {guide.description}
                    </MDTypography>
                    
                    {/* Steps preview */}
                    <MDBox component="ol" sx={{ pl: 2, m: 0 }}>
                      {guide.steps.slice(0, 3).map((step, idx) => (
                        <MDTypography 
                          key={idx} 
                          component="li" 
                          variant="caption" 
                          color="text"
                          sx={{ mb: 0.5 }}
                        >
                          {step}
                        </MDTypography>
                      ))}
                      {guide.steps.length > 3 && (
                        <MDTypography variant="caption" color="info">
                          +{guide.steps.length - 3} more steps...
                        </MDTypography>
                      )}
                    </MDBox>

                    <MDBox display="flex" alignItems="center" mt={2} color="info.main">
                      <MDTypography variant="button" color="info" fontWeight="medium">
                        Try it now
                      </MDTypography>
                      <ExternalLink size={14} style={{ marginLeft: 4 }} />
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>

        {/* FAQs Section */}
        <MDBox mb={5}>
          <MDTypography variant="h5" fontWeight="medium" mb={3}>
            Frequently Asked Questions
          </MDTypography>

          {/* Category Filter */}
          <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                onClick={() => setActiveCategory(cat.id)}
                sx={{
                  bgcolor: activeCategory === cat.id ? 'info.main' : 'grey.100',
                  color: activeCategory === cat.id ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: activeCategory === cat.id ? 'info.dark' : 'grey.200',
                  },
                  '& .MuiChip-icon': {
                    color: activeCategory === cat.id ? 'white' : 'inherit'
                  }
                }}
              />
            ))}
          </MDBox>

          {/* FAQ Accordions */}
          <Card>
            {filteredFaqs.length === 0 ? (
              <MDBox p={4} textAlign="center">
                <HelpCircle size={48} color="#ccc" />
                <MDTypography variant="body1" color="text" mt={2}>
                  No FAQs match your search. Try different keywords.
                </MDTypography>
              </MDBox>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expandedFaq === `faq-${index}`}
                  onChange={handleFaqChange(`faq-${index}`)}
                  sx={{
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown size={20} />}
                    sx={{ py: 1 }}
                  >
                    <MDBox display="flex" alignItems="center" gap={2}>
                      <Chip 
                        label={faq.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'info.light', 
                          color: 'info.main',
                          fontSize: '0.7rem'
                        }} 
                      />
                      <MDTypography variant="body1" fontWeight="medium">
                        {faq.question}
                      </MDTypography>
                    </MDBox>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: 'grey.50', py: 2 }}>
                    <MDTypography variant="body2" color="text">
                      {faq.answer}
                    </MDTypography>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Card>
        </MDBox>

        {/* Contact Support */}
        <MDBox mb={5}>
          <MDTypography variant="h5" fontWeight="medium" mb={3}>
            Contact Support
          </MDTypography>
          <ContactSupportPanel />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default HelpCenter;

