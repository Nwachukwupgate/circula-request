import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MDButton from 'components/MDButton';
import CardText from '../CardText';
import MDBox from "components/MDBox";


const ViewDetails = (props) => {
  const { onClose, selectedValue, open, data } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <>
        <React.Fragment>    
            <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
                <DialogTitle>View {selectedValue === "dept" ? "Departments" : "Roles" }</DialogTitle>
                <DialogContent className='flex flex-col gap-4'>
                
                <div className='px-4'> 
                   <MDBox p={2}>
                        <MDBox component="ul" display="flex" flexDirection="column" pt={4} p={0} m={0}>
                            {data && data.map(data => (
                                <React.Fragment key={data?.id}>
                                    <CardText date={data?.name} />
                                </React.Fragment>
                            ))}
                        {/* <Invoice date="March, 01, 2019" id="#AR-803481" price="$300" noGutter /> */}
                        </MDBox>
                    </MDBox> 
                </div>
                </DialogContent>
                <DialogActions>
                    <MDButton  size="small" color='secondary' variant='outlined' onClick={handleClose}>Cancel</MDButton>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    </>
  )
}

export default ViewDetails