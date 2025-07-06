import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Card, CircularProgress, CardContent, Divider, Link, } from "@mui/material";
import { Send } from "lucide-react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useGetCircularIDQuery, useRespondToCircularMutation, useGetResponseIDQuery } from "api/apiSlice";

function CircularDetails() {
  const { id } = useParams();
  const { data: circular, isLoading } = useGetCircularIDQuery(id);
  const [respondToCircular, { isLoading: isSubmitting }] = useRespondToCircularMutation();
  const { data: responseData } = useGetResponseIDQuery(id, {
    pollingInterval: 8000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
 });
  const [response, setResponse] = useState("");

  const getTimeColor = (respondedAt) => {
    const now = new Date();
    const responded = new Date(respondedAt);
    const diffMs = now.getTime() - responded.getTime();
    const diffMinutes = diffMs / 60000;

    if (diffMinutes < 10) return "bg-green-500";
    if (diffMinutes < 60) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const formatResponseData = (data) => {
    return data?.map((response) => {
      const avatar = response?.name?.charAt(0)?.toUpperCase() || "?";
      const color = getTimeColor(response?.respondedAt);

      return {
        ...response,
        avatar,
        color,
      };
    }) || [];
  };

  const formattedResponses = useMemo(() => formatResponseData(responseData), [responseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await respondToCircular({message: response, circularId: id}).unwrap();
      setResponse("");
    } catch (err) {
      console.error("Failed to create circular:", err);
      alert("An error occurred while creating the circular.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Event: {circular?.title}</h2>
                      {circular?.eventName && (
                        <MDTypography variant="subtitle1" color="textSecondary" gutterBottom>
                          Event: {circular.eventName}
                        </MDTypography>
                      )}
                      <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: circular?.body || '' }} />
                    </div>

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

                    <div className="flex-1 mb-6">
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Responses</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {responseData?.length}
                        </span>
                      </div>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {formattedResponses?.map((response) => (
                          <div 
                            key={response?.id} 
                            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 ${response?.color} rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg`}>
                                {response?.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">{response?.name}</h4>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                    {response?.department}/{response?.role}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-3 leading-relaxed">{response?.message}</p>
                                <p className="text-sm text-gray-500">{new Date(response?.respondedAt).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
                      <form className="flex gap-4">
                        <div className="flex-1">
                          <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your response..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="3"
                          />
                        </div>
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !response.trim()}
                          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                            response.trim()
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-5 h-5" />
                            {isSubmitting ? "Sending..." : "Send Response"}
                        </button>
                      </form>
                    </div>

                    <Divider className="my-6" />
                  </div>
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
