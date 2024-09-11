import { Formik, Form, Field, ErrorMessage } from "formik";
import { useReqPasswordResetMutation } from "api/apiSlice";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";

import { toast } from "react-toastify";


function Cover() {
  const [ reqPasswordReset, {isLoading } ] = useReqPasswordResetMutation();

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values) => {
    console.log("clicked btn");   
    console.log(values);
    const { email } = values;

    try {
      const response = await reqPasswordReset({ email }).unwrap();
      toast.success(response.message || 'Check your Mail box!');

    } catch (err) {
      const errorMessage = err?.data?.message || 'Action failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail in maximum 60 seconds
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <Formik
            initialValues={initialValues}
            validator={() => ({})}
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
                <MDBox mt={6} mb={1}>
                  <MDButton type="submit" variant="gradient" color="info" fullWidth>
                    {isLoading ? <Box><CircularProgress /></Box> : "reset"}
                  </MDButton>
                </MDBox>
               
              </Form>
            )}
          </Formik>            
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
