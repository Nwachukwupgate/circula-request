import React, { useState } from "react";
import {
  TextField, Button, MenuItem, InputLabel, Select, FormControl,
  Typography, Autocomplete, Chip, Dialog as MuiDialog, DialogTitle,
  DialogContent as MuiDialogContent, DialogActions, Alert, Box,
  Card, CardContent, IconButton,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import MDButton from 'components/MDButton';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {
  useCreateCircularMutation,
  useGetDepartmentQuery,
  useGetRoleQuery,
  useGetUserDepartmentQuery
} from "api/apiSlice";
import CircularProgress from '@mui/material/CircularProgress';
import {
  UploadCloud,
  AlertTriangle,
  FileText,
  Megaphone,
  Calendar,
  Users,
  Shield,
  Lightbulb,
  CheckCircle,
  Globe,
  Building2,
  Briefcase,
  User,
} from "lucide-react";

// Styled upload button (consistent with request form)
const StyledUploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '14px 24px',
  border: '2px dashed #667eea',
  borderRadius: '12px',
  backgroundColor: '#f8f9ff',
  color: '#667eea',
  fontWeight: 600,
  textTransform: 'none',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#eef0ff',
    borderColor: '#5a6fd6',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Circular templates
const circularTemplates = [
  {
    id: 'announcement',
    icon: <Megaphone size={24} />,
    title: 'General Announcement',
    description: 'Share important news or updates',
    template: `<h3>📢 Announcement</h3>
<p>Dear Team,</p>
<p>We are pleased to announce that [describe the announcement here].</p>
<p><strong>Key Points:</strong></p>
<ul>
<li>Point 1</li>
<li>Point 2</li>
<li>Point 3</li>
</ul>
<p>If you have any questions, please reach out to [contact person/department].</p>
<p>Best regards,<br/>[Your Name]</p>`,
  },
  {
    id: 'policy',
    icon: <Shield size={24} />,
    title: 'Policy Update',
    description: 'Communicate policy changes',
    template: `<h3>📋 Policy Update Notice</h3>
<p>Dear Colleagues,</p>
<p>This circular is to inform you of updates to our [policy name].</p>
<p><strong>Effective Date:</strong> [Date]</p>
<p><strong>What's Changing:</strong></p>
<ul>
<li>[Change 1]</li>
<li>[Change 2]</li>
</ul>
<p><strong>Action Required:</strong></p>
<p>[Describe any actions employees need to take]</p>
<p>For the full policy document, please refer to [link/location].</p>
<p>Thank you for your cooperation.</p>`,
  },
  {
    id: 'event',
    icon: <Calendar size={24} />,
    title: 'Event Invitation',
    description: 'Invite staff to an event',
    template: `<h3>🎉 You're Invited!</h3>
<p>Dear Team,</p>
<p>We are excited to invite you to [Event Name].</p>
<p><strong>📅 Date:</strong> [Date]</p>
<p><strong>🕐 Time:</strong> [Time]</p>
<p><strong>📍 Location:</strong> [Venue/Virtual Link]</p>
<p><strong>About the Event:</strong></p>
<p>[Brief description of the event]</p>
<p><strong>RSVP:</strong> Please confirm your attendance by [deadline] via [method].</p>
<p>We look forward to seeing you there!</p>`,
  },
  {
    id: 'reminder',
    icon: <Lightbulb size={24} />,
    title: 'Reminder',
    description: 'Send a friendly reminder',
    template: `<h3>⏰ Friendly Reminder</h3>
<p>Dear Team,</p>
<p>This is a reminder about [subject of reminder].</p>
<p><strong>Deadline:</strong> [Date/Time]</p>
<p><strong>What You Need to Do:</strong></p>
<ol>
<li>[Action item 1]</li>
<li>[Action item 2]</li>
</ol>
<p>If you have already completed this, please disregard this message.</p>
<p>Questions? Contact [name/department].</p>
<p>Thank you!</p>`,
  },
  {
    id: 'blank',
    icon: <FileText size={24} />,
    title: 'Blank',
    description: 'Start from scratch',
    template: '',
  },
];

const audienceOptions = [
  { value: "company", label: "🌐 Entire Company", icon: <Globe size={18} />, description: "All employees will receive this", warning: true },
  { value: "department", label: "🏢 Department(s)", icon: <Building2 size={18} />, description: "Selected departments only" },
  { value: "role", label: "💼 Role(s)", icon: <Briefcase size={18} />, description: "Selected roles only" },
  { value: "individual", label: "👤 Individual Staff", icon: <User size={18} />, description: "Specific employees only" },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateCircular({ handleClose, open }) {
  const [step, setStep] = useState(0); // 0: template, 1: form
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [audience, setAudience] = useState("company");
  const [title, setTitle] = useState("");
  const [eventName, setEventName] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [createCircular, { isLoading }] = useCreateCircularMutation();

  const { data: departments = [] } = useGetDepartmentQuery();
  const { data: roles = [] } = useGetRoleQuery();
  const { data: usersByDept = { users: [] }, isLoading: isUsersLoading, isFetching: isUsersFetching } = useGetUserDepartmentQuery(
    selectedDepartment?.id, { skip: !selectedDepartment }
  );

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setBody(template.template);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show warning for company-wide circulars
    if (audience === "company" && !showWarning) {
      setShowWarning(true);
      return;
    }

    let base64File = null;
    if (file) {
      base64File = await convertFileToBase64(file);
    }

    const payload = {
      title,
      eventName,
      body,
      targetType: audience,
      file: base64File,
    };

    if (audience === "department") {
      payload.selectedDepartments = selectedDepartments.map(dep => dep.id);
    } else if (audience === "role") {
      payload.selectedRoles = selectedRoles.map(role => role.id);
    } else if (audience === "individual") {
      payload.selectedUsers = selectedUsers.map(user => user.id);
    }

    try {
      await createCircular(payload).unwrap();
      resetForm();
      handleClose();
    } catch (err) {
      console.error("Failed to create circular:", err);
      alert("An error occurred while creating the circular.");
    }
  };

  const resetForm = () => {
    setStep(0);
    setSelectedTemplate(null);
    setAudience("company");
    setTitle("");
    setEventName("");
    setBody("");
    setFile(null);
    setSelectedDepartment(null);
    setSelectedUsers([]);
    setSelectedDepartments([]);
    setSelectedRoles([]);
    setShowWarning(false);
  };

  const handleCloseDialog = () => {
    resetForm();
    handleClose();
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const getDeptLabel = (dept) => dept?.name || "";
  const getRoleLabel = (role) => role?.name || "";
  const getUserLabel = (user) => `${user.firstName} ${user.surname}`;

  // Get recipient count estimate
  const getRecipientEstimate = () => {
    if (audience === "company") return "All employees";
    if (audience === "department") return `${selectedDepartments.length} department(s)`;
    if (audience === "role") return `${selectedRoles.length} role(s)`;
    if (audience === "individual") return `${selectedUsers.length} person(s)`;
    return "";
  };

  return (
    <>
      {/* Company-wide Warning Dialog */}
      <MuiDialog open={showWarning} onClose={() => setShowWarning(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff7ed' }}>
          <AlertTriangle size={28} color="#f59e0b" />
          <span>Confirm Company-Wide Distribution</span>
        </DialogTitle>
        <MuiDialogContent sx={{ py: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are about to send this circular to <strong>everyone in the company</strong>.
          </Alert>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please confirm that this message is intended for all employees. Company-wide circulars should be used for:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>Major company announcements</li>
            <li>Policy changes affecting all staff</li>
            <li>Company-wide events or holidays</li>
            <li>Critical operational updates</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If this is meant for a specific group, please go back and select the appropriate audience.
          </Typography>
        </MuiDialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowWarning(false)} color="inherit">
            Go Back
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="warning"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={18} /> : <CheckCircle size={18} />}
          >
            Yes, Send to Everyone
          </Button>
        </DialogActions>
      </MuiDialog>

      {/* Main Dialog */}
      <Dialog fullScreen open={open} onClose={handleCloseDialog} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {step === 0 ? 'Choose a Template' : 'Create Circular'}
            </Typography>
            {step === 1 && (
              <div className='flex gap-3'>
                <MDButton size="small" color='secondary' variant='outlined' onClick={() => setStep(0)}>
                  ← Templates
                </MDButton>
                <MDButton size="small" color="white" variant="contained" onClick={handleSubmit} disabled={isLoading || !title || !body}>
                  {isLoading ? <CircularProgress size={20} /> : "Publish Circular"}
                </MDButton>
              </div>
            )}
          </Toolbar>
        </AppBar>

        {/* Step 0: Template Selection */}
        {step === 0 && (
          <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
              What type of circular are you creating?
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
              Choose a template to get started quickly, or start from scratch
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {circularTemplates.map((template) => (
                <Card
                  key={template.id}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#667eea',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                    },
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: '#f0f4ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: '#667eea',
                      }}
                    >
                      {template.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {template.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Step 1: Form */}
        {step === 1 && (
          <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
            {/* Selected Template Badge */}
            {selectedTemplate && selectedTemplate.id !== 'blank' && (
              <Alert 
                severity="info" 
                sx={{ mb: 3 }}
                action={
                  <Button size="small" onClick={() => setStep(0)}>
                    Change
                  </Button>
                }
              >
                Using template: <strong>{selectedTemplate.title}</strong>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Required Fields Note */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                <span>indicates required field</span>
              </Box>

              {/* Title */}
              <TextField
                fullWidth
                label="Title *"
                variant="outlined"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear, descriptive title"
                helperText="Make it clear and actionable (e.g., 'New Leave Policy Effective Jan 2026')"
              />

              {/* Event Name */}
              <TextField
                fullWidth
                label="Event Name (Optional)"
                variant="outlined"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="If this relates to an event, add its name here"
              />

              {/* Target Audience */}
              <FormControl fullWidth>
                <InputLabel id="audience-label">Target Audience *</InputLabel>
                <Select
                  labelId="audience-label"
                  value={audience}
                  label="Target Audience *"
                  onChange={(e) => {
                    setAudience(e.target.value);
                    setSelectedUsers([]);
                    setSelectedDepartment(null);
                    setSelectedDepartments([]);
                    setSelectedRoles([]);
                  }}
                  sx={{ height: 60 }}
                >
                  {audienceOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {opt.icon}
                        <Box>
                          <Typography variant="body1">{opt.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {opt.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Company-wide Warning */}
              {audience === "company" && (
                <Alert severity="warning" icon={<AlertTriangle size={20} />}>
                  <strong>Company-wide distribution:</strong> This circular will be sent to all employees. 
                  Please ensure the content is appropriate for everyone.
                </Alert>
              )}

              {/* Individual Selection */}
              {audience === "individual" && (
                <>
                  <Autocomplete
                    options={departments}
                    getOptionLabel={getDeptLabel}
                    value={selectedDepartment}
                    onChange={(e, newVal) => {
                      setSelectedDepartment(newVal);
                      setSelectedUsers([]);
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Department First *" />}
                  />
                  {selectedDepartment && (
                    <Autocomplete
                      multiple
                      options={usersByDept.users}
                      getOptionLabel={getUserLabel}
                      value={selectedUsers}
                      onChange={(e, newVal) => setSelectedUsers(newVal)}
                      loading={isUsersLoading || isUsersFetching}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip key={option.id} variant="outlined" label={getUserLabel(option)} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Staff *"
                          placeholder="Start typing name..."
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {(isUsersLoading || isUsersFetching) && <CircularProgress color="inherit" size={20} />}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                </>
              )}

              {/* Department Selection */}
              {audience === "department" && (
                <Autocomplete
                  multiple
                  options={departments}
                  getOptionLabel={getDeptLabel}
                  value={selectedDepartments}
                  onChange={(e, newVal) => setSelectedDepartments(newVal)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={option.id} variant="outlined" label={getDeptLabel(option)} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} label="Select Department(s) *" />}
                />
              )}

              {/* Role Selection */}
              {audience === "role" && (
                <Autocomplete
                  multiple
                  options={roles}
                  getOptionLabel={getRoleLabel}
                  value={selectedRoles}
                  onChange={(e, newVal) => setSelectedRoles(newVal)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip key={option.id} variant="outlined" label={getRoleLabel(option)} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} label="Select Role(s) *" />}
                />
              )}

              {/* Rich Text Editor */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Content *
                </Typography>
                <Box sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 1,
                  '& .ql-container': { minHeight: 250 },
                  '& .ql-editor': { minHeight: 250 }
                }}>
                  <ReactQuill
                    theme="snow"
                    value={body}
                    onChange={setBody}
                    placeholder="Write your circular content here..."
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link'],
                        ['clean']
                      ],
                    }}
                  />
                </Box>
              </Box>

              {/* File Upload - Styled consistently */}
              <StyledUploadButton component="label">
                <UploadCloud size={28} />
                <span style={{ fontWeight: 600 }}>
                  {file ? file.name : 'Attach File (Optional)'}
                </span>
                <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                  PDF, Images, or Documents (Max 10MB)
                </Typography>
                <VisuallyHiddenInput 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                />
              </StyledUploadButton>
              {file && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Chip 
                    label={file.name} 
                    onDelete={() => setFile(null)} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              )}

              {/* Recipient Summary */}
              <Box sx={{ 
                bgcolor: '#f8f9fa', 
                borderRadius: 2, 
                p: 2, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Recipients
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {getRecipientEstimate()}
                  </Typography>
                </Box>
                <Users size={24} color="#667eea" />
              </Box>
            </form>
          </Box>
        )}
      </Dialog>
    </>
  );
}
