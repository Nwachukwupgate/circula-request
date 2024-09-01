import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import MDButton from 'components/MDButton';
import { useCreateRequestMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ handleClose, open }) {
  const [createRequest, {data, isLoading, isSuccess, error}] = useCreateRequestMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [formValues, setFormValues] = useState({
    itemName: '',
    itemDescription: '',
    amount: '',
    dateNeeded: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (newValue) => {
    setFormValues({
      ...formValues,
      dateNeeded: newValue ? newValue.format('YYYY-MM-DD') : '',
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormValues({
          ...formValues,
          image: reader.result, // Set the Base64 string as the image value
        });
      };
      reader.readAsDataURL(file); // Convert the file to a Base64 string
    }
  };
  
  useEffect(()=> {
    if(isSuccess) {
      toast.success("Request Made!")
    }
    if(error){
      toast.error("Error Occured try again")
    }
  }, [])

  const [cleared, setCleared] = useState(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

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

  const closeModal = useCallback(() => {
    handleClose();
    setFormValues({
      itemName: '',
      itemDescription: '',
      amount: '',
      dateNeeded: '',
      file: '',
    });
    setSelectedFile(null); // Reset file input state
  }, [handleClose]);
  console.log("formValues", formValues);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Submitted', formValues);
    try {
      const payload = {
        itemName: formValues.itemName,
        itemDescription: formValues.itemDescription,
        amount: formValues.amount,
        dateNeeded: formValues.dateNeeded,
        image: formValues.image, // This is now a Base64 string
      };
  
      await createRequest(payload).unwrap();
      setFormValues({
        itemName: '',
        itemDescription: '',
        amount: '',
        dateNeeded: '',
        file: '',
      });
      toast.success('Request Created!');
      // handleClose();
    } catch (err) {
      toast.error('Creation failed, try again', err);
    }
  };

  return (
    <React.Fragment>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Request
            </Typography>
            <div className='flex gap-4'>
                <MDButton size="small"color='secondary' variant='outlined' onClick={closeModal}>
                Cancel
                </MDButton>
                <MDButton size="small" color="info" variant="contained" type="submit" onClick={handleSubmit}>
                  {isLoading ? <CircularProgress /> : "Submit"}
                </MDButton>
            </div>
          </Toolbar>
        </AppBar>

        <DialogContent className="w-full flex justify-center items-center ">
          <div className="px-4 w-full md:w-[60%] flex gap-6 flex-col">
            <TextField
              fullWidth
              label="Request Name"
              name="itemName"
              value={formValues.itemName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formValues.amount}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ fontSize: '0.9rem' }}>&#8358;</span>
                  </InputAdornment>
                ),
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Target Date"
                value={formValues.dateNeeded ? dayjs(formValues.dateNeeded) : null}
                onChange={handleDateChange}
                slotProps={{
                  field: { clearable: true, onClear: () => setCleared(true) },
                }}
                required
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              multiline
              maxRows={6}
              minRows={4}
              margin="normal"
              label="Description"
              name="itemDescription"
              value={formValues.itemDescription}
              onChange={handleChange}
              required
            />

            <MDButton
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              color='info'
            >
              {selectedFile ? selectedFile : 'Upload Files'}
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </MDButton>
            {/* <div>

              <label class="block mb-2 text-sm font-medium text-gray-900" for="file">Upload file</label>
              <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none" id="file" name="file" type="file" onChange={handleFileChange}/>

            </div> */}
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
