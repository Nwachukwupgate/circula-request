
import { useState } from "react";
import { useLoginMutation } from "api/apiSlice";
import { useDispatch } from "react-redux";
import { GetUserToken } from "api/userSlice";

//import Formik
import { Formik, Form, Field, ErrorMessage } from "formik";

//import yup validator
import SigninValidation from "utils/validations/SigninValidation";

// react-router-dom components
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { toast } from "react-toastify";

function Basic() {

  const [ login, {isLoading, isSuccess, error, data } ] = useLoginMutation()
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    console.log(values);
    const { email, password } = values;

    try {
      const response = await login({ email, password }).unwrap();
      toast.success(response.message || 'Login successful!');
      
      if(response?.token) {
        localStorage.setItem("token", response?.token)
        console.log("data", response);     
        dispatch(GetUserToken(response.token));
        navigate("/dashboard")
      }
    } catch (err) {
      const errorMessage = err?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };


  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <Formik
            initialValues={initialValues}
            validationSchema={SigninValidation}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <MDBox mb={2}>
                  <Field
                    as={MDInput}
                    type="email"
                    name="email"
                    label="Email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={<ErrorMessage name="email" />}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <Field
                    as={MDInput}
                    type="password"
                    name="password"
                    label="Password"
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                    helperText={<ErrorMessage name="password" />}
                  />
                </MDBox>
                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    onClick={handleSetRememberMe}
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;Remember me
                  </MDTypography>
                </MDBox>
                <MDBox mt={4} mb={1}>
                  <MDButton type="submit" variant="gradient" color="info" fullWidth>
                    {isLoading ? <Box><CircularProgress /></Box> : "sign in"}
                  </MDButton>
                </MDBox>
               
              </Form>
            )}
          </Formik>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
