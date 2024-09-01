import React, { useState } from 'react';
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
import { useCreateRolesMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';


const CreateRole = ({ rolesClose, openRoles }) => {
    const [createRoles] = useCreateRolesMutation()
    const [formValues, setFormValues] = useState({
        name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        console.log('Form Submitted', formValues);
        try{
            await createRoles(formValues).unwrap();
            toast.success("Role Created!")
            rolesClose()
        }catch(err){
            toast.error("Cannot Create Role!")
        }
        // Add logic to handle form submission, e.g., API call
        
    };

    return (
      <>
        <React.Fragment>
          
          <Dialog
            open={openRoles}
            onClose={rolesClose}
            PaperProps={{
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                // const email = formJson.email;
                // console.log(email);
                rolesClose();
              },
            }}
          >
            <DialogTitle>Create Role</DialogTitle>
            
            <DialogContent className='flex flex-col gap-4'>
              
              <div className='px-4'> 
                <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                    sx={{  height:40}}
                  />
                </div>
            </DialogContent>
            <DialogActions>
              <MDButton  size="small" color='secondary' variant='outlined' onClick={rolesClose}>Cancel</MDButton>
              <MDButton size="small" color='info' variant='contained' type="submit" onClick={handleSubmit}>Submit</MDButton>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </>
    );
};

export default CreateRole;
