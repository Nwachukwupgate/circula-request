import React, { useState } from "react";
import {
  TextField, Button, MenuItem, InputLabel, Select, FormControl,
  Typography, Autocomplete, Chip
} from "@mui/material";
import { UploadCloud } from "lucide-react";
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
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

const audienceOptions = [
  { value: "company", label: "Entire Company" },
  { value: "department", label: "Department(s)" },
  { value: "role", label: "Role(s)" },
  { value: "individual", label: "Individual Staff" },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateCircular({ handleClose, open }) {
  const [audience, setAudience] = useState("company");
  const [title, setTitle] = useState("");
  const [eventName, setEventName] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [createCircular, { isLoading }] = useCreateCircularMutation();

  const { data: departments = [] } = useGetDepartmentQuery();
  const { data: roles = [] } = useGetRoleQuery();
  const { data: usersByDept = { users: [] }, isLoading: isUsersLoading, isFetching: isUsersFetching,} = useGetUserDepartmentQuery(
    selectedDepartment?.id, { skip: !selectedDepartment });


  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const res = await createCircular(payload).unwrap();
      console.log("Circular created:", res);
      handleClose();
    } catch (err) {
      console.error("Failed to create circular:", err);
      alert("An error occurred while creating the circular.");
    }
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

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Create Circular
          </Typography>
          <div className='flex gap-4'>
            <MDButton size="small" color='secondary' variant='outlined' onClick={handleClose}>
              Cancel
            </MDButton>
            <MDButton size="small" color="info" variant="contained" type="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <CircularProgress /> : "Submit"}
            </MDButton>
          </div>
        </Toolbar>
      </AppBar>

      <div className="p-6 md:p-10 max-w-6xl w-full md:w-[70%] mx-auto bg-white shadow-xl rounded-2xl">
        <Typography variant="h4" className="mb-6 text-gray-800">
          Create Circular
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField fullWidth label="Title" variant="outlined" required value={title} onChange={(e) => setTitle(e.target.value)} />

          <TextField fullWidth label="Event Name (Optional)" variant="outlined" value={eventName} onChange={(e) => setEventName(e.target.value)} />

          <FormControl fullWidth>
            <InputLabel id="audience-label">Target Audience</InputLabel>
            <Select
              labelId="audience-label"
              value={audience}
              label="Target Audience"
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
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

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
                renderInput={(params) => <TextField {...params} label="Select Department" />}
              />
              {selectedDepartment && (
                <Autocomplete
                  multiple
                  options={usersByDept.users}
                  getOptionLabel={getUserLabel}
                  value={selectedUsers}
                  onChange={(e, newVal) => setSelectedUsers(newVal)}
                  loading={isUsersLoading || isUsersFetching}   // ✅ loader here
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.id}
                        variant="outlined"
                        label={getUserLabel(option)}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Staff"
                      placeholder="Start typing name..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(isUsersLoading || isUsersFetching) && (
                              <CircularProgress color="inherit" size={20} />
                            )}
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
              renderInput={(params) => <TextField {...params} label="Select Department(s)" />}
            />
          )}

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
              renderInput={(params) => <TextField {...params} label="Select Role(s)" />}
            />
          )}

          <div className="bg-white rounded-md">
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              style={{ height: "300px", marginBottom: "40px" }}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <UploadCloud size={24} />
              <span>Attach File</span>
              <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
            </label>
            {file && <span className="text-sm text-gray-600">{file.name}</span>}
          </div>
        </form>
      </div>
    </Dialog>
  );
}
