import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { DialogContent } from '@mui/material';
import MDInput from 'components/MDInput';
import TextField from '@mui/material/TextField';
import MDButton from 'components/MDButton';
import { useCreateRequestMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({handleClose, open}) {
    const [createRequest] = useCreateRequestMutation()
    const [formValues, setFormValues] = useState({ 
        itemName:'',
        itemDescription: '' ,
        amount: '',
        dateNeeded: '',
        imageUrl: '',
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
        try{
          await createRequest(formValues)
          toast.success('User Created!')
          handleClose();
        }catch(err){
          toast.error("Try again Creating user failed", err)
        }
    };
  
  return (
    <React.Fragment>
      
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Request
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button> */}
            <MDButton size="small" color='info' variant='contained' type="submit" onClick={handleSubmit}>Submit</MDButton> 
          </Toolbar>
        </AppBar>
      
        <DialogContent className='w-full flex justify-center'>
            <div className='px-4 w-full md:w-[70%] flex gap-6 flex-col'> 
                 <TextField
                fullWidth
                margin="normal"
                label="Item Name"
                name="itemName"
                value={formValues.itemName}
                onChange={handleChange}
                required
                />
                <TextField
                fullWidth
                margin="normal"
                label="Amount"
                name="amount"
                type='number'
                value={formValues.amount}
                onChange={handleChange}
                required
                />
                <TextField
                fullWidth
                margin="normal"
                label="Date"
                name="dateNeeded"
                type="dateNeeded"
                value={formValues.dateNeeded}
                onChange={handleChange}
                required
                />
                <TextField
                fullWidth
                multiline
                maxRows={6}
                margin="normal"
                label="Discription"
                name="itemDescription"
                value={formValues.itemDescription}
                onChange={handleChange}
                required
                />
            </div>
        </DialogContent>

        {/* <DialogActions> */}
            {/* <MDButton  size="small" color='secondary' variant='outlined' onClick={handleClose}>Cancel</MDButton>
            <MDButton size="small" color='info' variant='contained' type="submit" onClick={handleSubmit}>Submit</MDButton> */}
        {/* </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
}
