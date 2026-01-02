import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useGetDepartmentQuery } from 'api/apiSlice';
import { useGetRoleQuery } from 'api/apiSlice';
import { useCreateEmployeeMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { Camera, User } from 'lucide-react';


const CreateModal = ({ handleClose }) => {
  const {data} = useGetDepartmentQuery()
  const {data:roles} = useGetRoleQuery()
  const [createEmployee, {data: employeeData, error, isSuccess, isLoading}] = useCreateEmployeeMutation()
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

    const [formValues, setFormValues] = useState({
        firstName: '',
        surname: '',
        email: '',
        password: '',
        departmentId: '',
        roleId: '',
        employeeType: 'staff',
        phone: '',
        bio: '',
        location: '',
        jobTitle: '',
        profileImage: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
            
            setFormValues({
                ...formValues,
                profileImage: file,
            });
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('firstName', formValues.firstName);
        formData.append('surname', formValues.surname);
        formData.append('email', formValues.email);
        formData.append('departmentId', formValues.departmentId);
        formData.append('roleId', formValues.roleId);
        formData.append('employeeType', formValues.employeeType);
        formData.append('phone', formValues.phone);
        formData.append('bio', formValues.bio);
        formData.append('location', formValues.location);
        formData.append('jobTitle', formValues.jobTitle);
        
        if (formValues.profileImage) {
            formData.append('profileImage', formValues.profileImage);
        }
        
        createEmployee(formData)
        .then((info) => {
            toast.success("Employee Created!");  
            handleClose();        
        })
        .catch((err) => {
          toast.error(err?.message ?? err?.data?.message);
        });
    };

    useEffect(()=> {
      if(error) {    
        toast.error(error.message ?? error?.data?.message);
      }
      if(isSuccess){
        toast.success(employeeData?.message);  
        handleClose();    
      }
    },[employeeData, error, isSuccess, handleClose])

    return (
      <>
        <React.Fragment>
          <Dialog
            open={true}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: { borderRadius: 2 }
            }}
          >
            <DialogTitle>
              <MDTypography variant="h5" fontWeight="medium">
                Create New Employee
              </MDTypography>
            </DialogTitle>
            <DialogContent>
              {/* Profile Image Upload */}
              <MDBox display="flex" justifyContent="center" mb={3} mt={2}>
                <Box position="relative">
                  <Avatar
                    src={imagePreview}
                    sx={{
                      width: 100,
                      height: 100,
                      cursor: 'pointer',
                      bgcolor: 'grey.300',
                      border: '3px solid',
                      borderColor: 'primary.main',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!imagePreview && <User size={40} />}
                  </Avatar>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={16} />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Box>
              </MDBox>
              <MDTypography variant="caption" color="text" display="block" textAlign="center" mb={3}>
                Click to upload profile photo
              </MDTypography>

              {/* Basic Information */}
              <MDTypography variant="subtitle2" fontWeight="medium" mb={2} color="info">
                Basic Information
              </MDTypography>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-2 mb-4'> 
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Surname"
                  name="surname"
                  value={formValues.surname}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                />
              </div>

              {/* Job Information */}
              <MDTypography variant="subtitle2" fontWeight="medium" mb={2} mt={3} color="info">
                Job Information
              </MDTypography>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-2 mb-4'>
                <TextField
                  fullWidth
                  size="small"
                  label="Job Title"
                  name="jobTitle"
                  value={formValues.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Location"
                  name="location"
                  value={formValues.location}
                  onChange={handleChange}
                  placeholder="e.g. Lagos, Nigeria"
                />
                
                <FormControl fullWidth size="small">
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    value={formValues.departmentId}
                    label="Department"
                    name="departmentId"
                    onChange={handleChange}
                    sx={{ height: 40 }}
                  >
                    {data && data?.map(dept => (
                        <MenuItem key={dept?.id} value={dept?.id}>{dept?.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    name="roleId"
                    value={formValues.roleId}
                    onChange={handleChange}
                    label='Role'
                    required
                    sx={{ height: 40 }}
                  >
                    {roles && roles?.map((role) => (
                        <MenuItem key={role.id} value={role?.id}>
                            {role.name}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel id="employee-type-label">Employee Type</InputLabel>
                    <Select
                      labelId="employee-type-label"
                      name="employeeType"
                      value={formValues.employeeType}
                      onChange={handleChange}
                      label='Employee Type'
                      required
                      sx={{ height: 40 }}
                    >
                      <MenuItem value="staff">Staff</MenuItem>
                      <MenuItem value="contract">Contract</MenuItem>
                    </Select>
                </FormControl> 
              </div>

              {/* Additional Information */}
              <MDTypography variant="subtitle2" fontWeight="medium" mb={2} mt={3} color="info">
                Additional Information
              </MDTypography>
              <div className='px-2'>
                <TextField
                  fullWidth
                  size="small"
                  label="Bio"
                  name="bio"
                  value={formValues.bio}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="A brief description about the employee..."
                />
              </div>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <MDButton size="small" color='secondary' variant='outlined' onClick={handleClose}>
                Cancel
              </MDButton>
              <MDButton size="small" color='info' variant='contained' type="submit" onClick={handleSubmit}>
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Create Employee'
                )}
              </MDButton>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </>
    );
};

export default CreateModal;
