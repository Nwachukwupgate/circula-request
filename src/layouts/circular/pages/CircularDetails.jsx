import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Card,
  CircularProgress,
  CardContent,
  Divider,
  Link,
} from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useGetCircularIDQuery, useRespondToCircularMutation, useGetResponseIDQuery } from "api/apiSlice";

function CircularDetails() {
  const { id } = useParams();
  const { data: circular, isLoading } = useGetCircularIDQuery(id);
  const [respondToCircular, { isLoading: isSubmitting }] = useRespondToCircularMutation();
  const { data: responseData } = useGetResponseIDQuery(id, {
    pollingInterval: 80000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
 });
 console.log(responseData);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await respondToCircular({message: response, circularId: id}).unwrap();
      console.log("Circular created:", res);

    } catch (err) {
      console.error("Failed to create circular:", err);
      alert("An error occurred while creating the circular.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />

      <MDBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <CircularProgress />
              </div>
            ) : (
              <Card className="shadow-md">
                <CardContent>
                  {/* Title */}
                  <MDTypography variant="h4" gutterBottom>
                    {circular?.title}
                  </MDTypography>

                  {/* Event Name */}
                  {circular?.eventName && (
                    <MDTypography variant="subtitle1" color="textSecondary" gutterBottom>
                      Event: {circular.eventName}
                    </MDTypography>
                  )}

                  {/* Body */}
                  <MDTypography
                    variant="body1"
                    className="text-gray-700 mb-4"
                    dangerouslySetInnerHTML={{ __html: circular?.body || '' }}
                  />


                  {/* Attachment */}
                  {circular?.attachment && (
                    <MDTypography variant="body2" className="mb-4">
                      Attachment:{" "}
                      <Link
                        href={circular.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="info"
                        underline="hover"
                      >
                        View/Download
                      </Link>
                    </MDTypography>
                  )}

                  <Divider className="my-4" />

                  {/* Response Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                      label="Your Response"
                      fullWidth
                      multiline
                      minRows={3}
                      variant="outlined"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                    />
                    <MDButton type="submit" color="info" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Response"}
                    </MDButton>
                  </form>

                  <Divider className="my-6" />

                  {/* Responses */}
                  <MDTypography variant="h6" gutterBottom>
                    Responses
                  </MDTypography>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {responseData?.length > 0 ? (
                      responseData?.map((res, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                            <div className="flex items-center mb-2">
                                <p className="text-sm font-semibold text-blue-700">
                                    {res.name}:
                                </p>

                                <p className="text-sm text-gray-500 ml-2">{res?.department}/{res.role}</p>
                            </div>
                          
                          <p className="text-gray-800">{res.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(res.respondedAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No responses yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default CircularDetails;
