import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useCreateDepartmentMutation } from 'api/apiSlice';
import DialogTitle from '@mui/material/DialogTitle';
import MDButton from 'components/MDButton';


const CreateModal = ({ handleClose, modalType, deptClose, openDepts }) => {
  const [createDepartment, {data}] = useCreateDepartmentMutation()
    const [formValues, setFormValues] = useState({
        name: '',
    });
    console.log();
    
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
        // Add logic to handle form submission, e.g., API call
        try{
          await createDepartment(formValues)
          toast.success("Department Created!")
          handleClose()
        }catch(err){
          toast.error("failed to Create Department")
        }
        
    };

    return (
      <>
        <React.Fragment>
          
          <Dialog
            open={openDepts}
            onClose={deptClose}
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
            <DialogTitle>Create Department</DialogTitle>
            <DialogContent className='flex flex-col gap-4'>
              
              <div className='px-4'> 
                <TextField
                    fullWidth
                    margin="normal"
                    label="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </div>
            </DialogContent>
            <DialogActions>
              <MDButton  size="small" color='secondary' variant='outlined' onClick={deptClose}>Cancel</MDButton>
              <MDButton size="small" color='info' variant='contained' type="submit" onClick={handleSubmit}>Submit</MDButton>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </>
    );
};

export default CreateModal;
