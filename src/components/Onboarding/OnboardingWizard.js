import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { 
  X, 
  FileText, 
  Target, 
  Bell, 
  BookOpen, 
  User, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  CheckCircle,
  Rocket
} from 'lucide-react';

const ONBOARDING_KEY = 'circula_onboarding_completed';
const ONBOARDING_STEP_KEY = 'circula_onboarding_step';

const OnboardingWizard = ({ open, onClose, userName = 'User' }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    {
      title: 'Welcome to Circula-Request! 🎉',
      icon: <Sparkles size={48} className="text-blue-500" />,
      content: {
        heading: `Hi ${userName}, welcome aboard!`,
        description: "We're excited to have you. This quick tour will help you get the most out of the platform. It only takes 2 minutes!",
        features: [
          'Submit and track requests',
          'Manage your KPIs and performance',
          'Stay updated with company circulars',
          'Access personalized growth resources'
        ]
      }
    },
    {
      title: 'Making Requests',
      icon: <FileText size={48} className="text-green-500" />,
      content: {
        heading: 'Submit Requests Easily',
        description: 'Need supplies, leave approval, or IT support? Our request system handles it all with automated approval workflows.',
        tips: [
          { label: 'Quick Access', text: 'Click "Make Request" button on the Requests page' },
          { label: 'Track Status', text: 'View real-time approval progress on your dashboard' },
          { label: 'Get Notified', text: 'Receive instant notifications when status changes' }
        ],
        action: { label: 'Try: Make Your First Request', route: '/request' }
      }
    },
    {
      title: 'KPI Management',
      icon: <Target size={48} className="text-purple-500" />,
      content: {
        heading: 'Track Your Performance',
        description: 'View assigned KPIs, submit progress reports, and get AI-powered insights to help you achieve your goals.',
        tips: [
          { label: 'View KPIs', text: 'See all assigned KPIs in your KPI Dashboard' },
          { label: 'Submit Reports', text: 'Update your progress regularly to stay on track' },
          { label: 'AI Insights', text: 'Get personalized recommendations and reminders' }
        ],
        action: { label: 'Try: View Your KPIs', route: '/kpi' }
      }
    },
    {
      title: 'Stay Informed',
      icon: <Bell size={48} className="text-orange-500" />,
      content: {
        heading: 'Never Miss an Update',
        description: 'Company circulars, approval notifications, and KPI reminders - all in one place.',
        tips: [
          { label: 'Notification Bell', text: 'Check the bell icon in the navbar for updates' },
          { label: 'Circulars', text: 'Important company announcements appear automatically' },
          { label: 'Customize', text: 'Set your notification preferences in your profile' }
        ],
        action: { label: 'Try: Check Notifications', route: '/notifications' }
      }
    },
    {
      title: 'Grow Your Skills',
      icon: <BookOpen size={48} className="text-teal-500" />,
      content: {
        heading: 'Personal Development',
        description: 'Access curated learning resources tailored to your role and current KPIs.',
        tips: [
          { label: 'Growth Library', text: 'Browse courses, articles, and tools' },
          { label: 'Personalized', text: 'Recommendations based on your department and tasks' },
          { label: 'Track Progress', text: 'Mark resources as completed to track your growth' }
        ],
        action: { label: 'Try: Explore Growth Library', route: '/resources' }
      }
    },
    {
      title: 'Your Profile',
      icon: <User size={48} className="text-indigo-500" />,
      content: {
        heading: 'Personalize Your Experience',
        description: 'Update your profile, set preferences, and make the platform work for you.',
        tips: [
          { label: 'Profile Photo', text: 'Add a photo to help colleagues recognize you' },
          { label: 'Settings', text: 'Customize email and app notification preferences' },
          { label: 'Bio', text: 'Share a bit about yourself with your team' }
        ],
        action: { label: 'Try: Update Your Profile', route: '/profile' }
      }
    },
    {
      title: "You're All Set! 🚀",
      icon: <Rocket size={48} className="text-blue-600" />,
      content: {
        heading: 'Ready to Get Started',
        description: "You've completed the onboarding tour. Here's a quick summary of what you can do:",
        checklist: [
          { text: 'Submit and track requests', done: true },
          { text: 'Monitor your KPIs', done: true },
          { text: 'Stay updated with notifications', done: true },
          { text: 'Access learning resources', done: true },
          { text: 'Customize your profile', done: true }
        ],
        helpNote: 'Need help anytime? Click the "?" icon or visit the Help Center from the sidebar.'
      }
    }
  ];

  useEffect(() => {
    // Restore step if user closed wizard mid-way
    const savedStep = localStorage.getItem(ONBOARDING_STEP_KEY);
    if (savedStep) {
      setActiveStep(parseInt(savedStep, 10));
    }
  }, []);

  const handleNext = () => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    localStorage.setItem(ONBOARDING_STEP_KEY, nextStep.toString());
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    localStorage.setItem(ONBOARDING_STEP_KEY, prevStep.toString());
  };

  const handleComplete = () => {
    setIsCompleting(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STEP_KEY);
    setTimeout(() => {
      onClose();
      navigate('/dashboard');
    }, 1000);
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STEP_KEY);
    onClose();
  };

  const handleTryAction = (route) => {
    localStorage.setItem(ONBOARDING_STEP_KEY, activeStep.toString());
    onClose();
    navigate(route);
  };

  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Dialog 
      open={open} 
      onClose={() => {}}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Progress bar */}
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 4,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
          }
        }} 
      />

      {/* Header */}
      <MDBox 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        px={3} 
        py={2}
        borderBottom="1px solid"
        borderColor="grey.200"
      >
        <MDTypography variant="caption" color="text">
          Step {activeStep + 1} of {steps.length}
        </MDTypography>
        <IconButton onClick={handleSkip} size="small">
          <X size={20} />
        </IconButton>
      </MDBox>

      <DialogContent sx={{ p: 0 }}>
        <MDBox 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          textAlign="center"
          px={4}
          py={5}
        >
          {/* Icon */}
          <MDBox 
            mb={3}
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currentStep.icon}
          </MDBox>

          {/* Title */}
          <MDTypography variant="h4" fontWeight="bold" mb={1}>
            {currentStep.content.heading}
          </MDTypography>

          {/* Description */}
          <MDTypography variant="body2" color="text" mb={3} sx={{ maxWidth: 500 }}>
            {currentStep.content.description}
          </MDTypography>

          {/* Features list (Welcome step) */}
          {currentStep.content.features && (
            <MDBox 
              display="flex" 
              flexDirection="column" 
              gap={1.5} 
              mb={3}
              sx={{ textAlign: 'left', width: '100%', maxWidth: 400 }}
            >
              {currentStep.content.features.map((feature, idx) => (
                <MDBox key={idx} display="flex" alignItems="center" gap={1.5}>
                  <CheckCircle size={20} className="text-green-500" />
                  <MDTypography variant="body2">{feature}</MDTypography>
                </MDBox>
              ))}
            </MDBox>
          )}

          {/* Tips (Feature steps) */}
          {currentStep.content.tips && (
            <MDBox 
              display="flex" 
              flexDirection="column" 
              gap={2} 
              mb={3}
              sx={{ 
                textAlign: 'left', 
                width: '100%', 
                maxWidth: 450,
                bgcolor: 'grey.50',
                borderRadius: 2,
                p: 3
              }}
            >
              {currentStep.content.tips.map((tip, idx) => (
                <MDBox key={idx}>
                  <MDTypography variant="caption" fontWeight="bold" color="info">
                    {tip.label}
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {tip.text}
                  </MDTypography>
                </MDBox>
              ))}
            </MDBox>
          )}

          {/* Checklist (Final step) */}
          {currentStep.content.checklist && (
            <MDBox 
              display="flex" 
              flexDirection="column" 
              gap={1.5} 
              mb={3}
              sx={{ textAlign: 'left', width: '100%', maxWidth: 350 }}
            >
              {currentStep.content.checklist.map((item, idx) => (
                <MDBox key={idx} display="flex" alignItems="center" gap={1.5}>
                  <CheckCircle size={20} className="text-green-500" />
                  <MDTypography variant="body2">{item.text}</MDTypography>
                </MDBox>
              ))}
            </MDBox>
          )}

          {/* Help note (Final step) */}
          {currentStep.content.helpNote && (
            <MDBox 
              sx={{ 
                bgcolor: 'info.light', 
                borderRadius: 2, 
                p: 2, 
                maxWidth: 400,
                opacity: 0.9
              }}
            >
              <MDTypography variant="caption" color="white">
                💡 {currentStep.content.helpNote}
              </MDTypography>
            </MDBox>
          )}

          {/* Try action button */}
          {currentStep.content.action && (
            <MDButton
              variant="outlined"
              color="info"
              size="small"
              onClick={() => handleTryAction(currentStep.content.action.route)}
              sx={{ mt: 2 }}
            >
              {currentStep.content.action.label}
              <ChevronRight size={16} />
            </MDButton>
          )}
        </MDBox>

        {/* Navigation */}
        <MDBox 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center"
          px={4}
          py={3}
          borderTop="1px solid"
          borderColor="grey.200"
          bgcolor="grey.50"
        >
          <MDButton
            variant="text"
            color="secondary"
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
          >
            <ChevronLeft size={18} />
            Back
          </MDButton>

          <MDBox display="flex" gap={1}>
            {/* Step indicators */}
            {steps.map((_, idx) => (
              <MDBox
                key={idx}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: idx === activeStep ? 'info.main' : 'grey.300',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </MDBox>

          {isLastStep ? (
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting ? 'Starting...' : 'Get Started'}
              <Rocket size={18} style={{ marginLeft: 8 }} />
            </MDButton>
          ) : (
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleNext}
            >
              Next
              <ChevronRight size={18} />
            </MDButton>
          )}
        </MDBox>
      </DialogContent>
    </Dialog>
  );
};

// Hook to check if onboarding should be shown
export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      // Delay slightly to let the app load
      const timer = setTimeout(() => setShowOnboarding(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(ONBOARDING_STEP_KEY);
    setShowOnboarding(true);
  };

  return { showOnboarding, setShowOnboarding, resetOnboarding };
};

export default OnboardingWizard;

