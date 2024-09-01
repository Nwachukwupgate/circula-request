import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MDButton from 'components/MDButton';
import { useGetDepartmentQuery } from 'api/apiSlice';
import { useGetRoleQuery } from 'api/apiSlice';
import { useCreateEmployeeMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';


const CreateModal = ({ handleClose, modalType, departmentData, roleData }) => {
  const {data} = useGetDepartmentQuery()
  const {data:roles} = useGetRoleQuery()
  const [createEmployee, {data: employeeData, error, isSuccess}] = useCreateEmployeeMutation()

    const [formValues, setFormValues] = useState({
        firstName: '',
        surname: '',
        email: '',
        password: '',
        departmentId: '',
        roleId: '',
        employeeType: 'staff',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Submitted', formValues);
        // Add logic to handle form submission, e.g., API call
        // try{
        //   const info = await createEmployee(formValues)
        //   toast.success(info.message)
        //   handleClose();
        // }catch(err){
        //   toast.error(err.message)
        // }
        createEmployee(formValues)
        .then((info) => {
            console.log(info);       
            toast.success(employeeData.message);           
        })
        .catch((err) => {
          console.log(err);       
          toast.error(err.message ?? err.data.message);
        });
    };

    useEffect(()=> {
      if(error) {
        console.log("err in useefect", error.data.message); 
        console.log("employeeData in employeeData", employeeData);     
        toast.error(error.message ?? error.data.message);
      }
      if(isSuccess){
        console.log("employeeData in employeeData", employeeData.message);  
        toast.success(employeeData.message);  
        handleClose();    
      }
    },[employeeData, error, isSuccess, handleClose])

    return (
      <>
        <React.Fragment>
          
          <Dialog
            open={true}
            onClose={handleClose}
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const email = formJson.email;
                console.log(email);
                handleClose();
              },
            }}
          >
            <DialogTitle>Create Employee</DialogTitle>
            <DialogContent className='flex flex-col gap-4'>
              
                <div className='px-4'> 
                  <TextField
                      fullWidth
                      margin="normal"
                      label="First Name"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Surname"
                      name="surname"
                      value={formValues.surname}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Password"
                      name="password"
                      type="password"
                      value={formValues.password}
                      onChange={handleChange}
                      required
                    />
                </div>
                <div className='flex flex-col gap-6 px-4'>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formValues.departmentId}
                      label="Department"
                      name="departmentId"
                      onChange={handleChange}
                      sx={{  height:40}}
                    >
                      {data && data?.map(dept => (
                          <MenuItem value={dept?.id}>{dept?.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      name="roleId"
                      id='roleId'
                      value={formValues.roleId}
                      onChange={handleChange}
                      label='Role'
                      required
                      sx={{  height:40}}

                    >
                      {roles && roles?.map((role) => (
                          <MenuItem key={role.id} value={role?.id}>
                              {role.name}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                      <InputLabel id="employee-type-label">Employee Type</InputLabel>
                      <Select
                        labelId="employee-type-label"
                        name="employeeType"
                        id='employeeType'
                        value={formValues.employeeType}
                        onChange={handleChange}
                        label='Employee Type'
                        required
                        sx={{  height:40}}
                      >
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="contract">Contract</MenuItem>
                      </Select>
                  </FormControl> 

                </div>
            </DialogContent>
            <DialogActions>
              <MDButton  size="small" color='secondary' variant='outlined' onClick={handleClose}>Cancel</MDButton>
              <MDButton size="small" color='info' variant='contained' type="submit" onClick={handleSubmit}>Submit</MDButton>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </>
    );
};

export default CreateModal;
