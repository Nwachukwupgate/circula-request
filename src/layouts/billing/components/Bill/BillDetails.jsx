import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MDButton from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useGetRequestIDQuery, useUpdateRequestStatusMutation, useGetProfileQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';


// Draggable Paper component
function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

// Main DraggableDialog component
export default function DraggableDialog({ open, onClose, id }) {
    const {data: info } = useGetProfileQuery()
    const [activeStep, setActiveStep] = useState(0);
    const [status, setStatus] = useState('');
    const [comment, setComment] = useState('')
    const [updateRequestStatus, { isLoading }] = useUpdateRequestStatusMutation();
    const { data } = useGetRequestIDQuery(id);    

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleComment = (event) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        if (data) {
            const { hodApprovalStatus, cfoApprovalStatus, cooApprovalStatus, mdApprovalStatus } = data;
            if (mdApprovalStatus === 'approved') {
                setActiveStep(4);
            } else if (cooApprovalStatus === 'approved') {
                setActiveStep(3);
            } else if (cfoApprovalStatus === 'approved') {
                setActiveStep(2);
            } else if (hodApprovalStatus === 'approved') {
                setActiveStep(1);
            } else {
                setActiveStep(0);
            }
        }
    }, [data]);

    if (!open) {
        return null; // Do not render anything if the dialog is not open
    }

    const steps = [
        'Head of Department Approval',
        'Chief Financial Officer Approval',
        'COO Approval',
        'Managing Director Approval',
        'Completed',
    ];

    // const getStepStatus = (stepIndex) => {
    //     switch (stepIndex) {
    //         case 0:
    //             return data?.hodApprovalStatus;
    //         case 1:
    //             return data?.cfoApprovalStatus;
    //         case 2:
    //             return data?.cooApprovalStatus;
    //         case 3:
    //             return data?.mdApprovalStatus;
    //         case 4:
    //             return data?.finalStatus;
    //         default:
    //             return 'pending';
    //     }
    // };

    const getStepStyle = (stepStatus) => {
        console.log('Final Status:', stepStatus);
        if (stepStatus === 'approved') {
          return 'green'; // Approved steps color
        } else if (stepStatus === 'rejected') {
          return 'red'; // Rejected steps color
        } else {
          return 'gray'; // Inactive steps color
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return 'Head of Department Approval Process.';
            case 1:
                return 'Chief Financial Officer Approval Process.';
            case 2:
                return 'COO Approval Process.';
            case 3:
                return 'Managing Director Approval Process.';
            case 4:
                return 'Authorization Process is Completed.';
            default:
                return 'Unknown step';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await updateRequestStatus({id, status, comment}).unwrap();
            toast.success("Successful!")
        }catch(error){
            toast.error("Failed, Try again")
        }        
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            maxWidth="md" // Adjust size here
            fullWidth
        >
            <DialogTitle
                style={{ cursor: 'move' }}
                id="draggable-dialog-title"
            >
                Request Details
            </DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%' }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel
                        sx={{
                            bgcolor: 'green', // Stepper background color
                        }}
                    >
                        {steps.map((label, index) => (
                            <Step key={label} active={index === activeStep}>
                                <StepLabel sx={getStepStyle(index)}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {getStepContent(activeStep)}
                        </Typography>
                    </Box>
                    <Box className="space-y-1.5">
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Name:</p>
                            <p>{data?.user?.firstName} {data?.user?.surname}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Department:</p>
                            <p>{data?.requestDepartment?.name}/{data?.role?.name}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Item:</p>
                            <p>{data?.itemName}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Description:</p>
                            <p>{data?.itemDescription}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Amount:</p>
                            <p>{data?.amount}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Date Needed:</p>
                            <p>{data?.dateNeeded}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>HOD Approval:</p>
                            <p style={{ color: getStepStyle(data?.finalStatus) }}>{data?.hodApprovalStatus}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>CFO Approval:</p>
                            <p style={{ color: getStepStyle(data?.finalStatus) }}>{data?.cfoApprovalStatus}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>COO Approval:</p>
                            <p style={{ color: getStepStyle(data?.finalStatus) }}>{data?.cooApprovalStatus}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>MD Approval:</p>
                            <p style={{ color: getStepStyle(data?.finalStatus) }}>{data?.mdApprovalStatus}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Account Status:</p>
                            <p  style={{ color: getStepStyle(data?.finalStatus) }}>{data?.accountStatus}</p>
                        </div>
                        <div className='flex justify-between px-6 border-2 p-1'>
                            <p className='font-bold'>Final Status:</p>
                            <p style={{ color: getStepStyle(data?.finalStatus) }}>{data?.finalStatus}</p>
                        </div>
                        <div className='border-2 p-1 px-6'>
                            <p className='font-bold'>Image:</p> 
                            <p
                                onClick={() => {
                                    if (data?.imageUrl) {
                                        window.open(data.imageUrl, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Optional: Style to indicate it's clickable
                                className='break-all'
                            >
                                {data?.imageUrl}
                            </p>
                        </div>

                        {['CFO', 'COO', 'MD', 'Account HOD', 'HOD'].includes(info?.role?.name) ?
                        <>
                            <div>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }} fullWidth>
                                    <InputLabel id="demo-simple-select-standard-label" className='font-bold'>Status</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={status}
                                    onChange={handleChange}
                                    label="status"
                                    sx={{  height:40}}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="approved">Approve</MenuItem>
                                        <MenuItem value="rejected">Reject</MenuItem>
                                        {info?.role?.name === "Account HOD" &&
                                            <MenuItem value="paid">Pay</MenuItem>
                                        }
                                    </Select>
                                </FormControl>

                                <div className='mt-4'>
                                <TextField
                                    fullWidth
                                    label="Comment"
                                    name="comment"
                                    type="text"
                                    value={comment}
                                    onChange={handleComment}
                                    required                               
                                />
                                </div>
                            </div>

                            <div className='flex justify-end mt-12'>
                                <MDButton
                                size="small"
                                color="success"
                                variant="contained"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading} // Disable the button when loading
                                >
                                    {isLoading ? 'Loading...' : `${status || 'Submit'} Request`} 
                                </MDButton>
                            </div>
                        </>
                        :
                        null
                        } 
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
