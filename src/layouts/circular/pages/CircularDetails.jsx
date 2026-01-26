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

  const formattedResponses = useMemo(() => formatResponseData(responseData), [responseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await respondToCircular({message: response, circularId: id}).unwrap();
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

                    {/* Attachment Section */}
                    {(circular?.attachment || circular?.file) && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Attached File</p>
                            <p className="text-sm text-gray-500">Click to view or download</p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={circular.attachment || circular.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </Link>
                            <a
                              href={circular.attachment || circular.file}
                              download
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                          </div>
                        </div>
                        
                        {/* Preview for images */}
                        {(circular.attachment || circular.file)?.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                          <div className="mt-4">
                            <img 
                              src={circular.attachment || circular.file} 
                              alt="Attachment preview" 
                              className="max-w-full max-h-64 rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                        
                        {/* Preview for PDFs - show link info */}
                        {(circular.attachment || circular.file)?.match(/\.pdf$/i) && (
                          <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-3">
                            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
                            </svg>
                            <span className="text-sm text-red-700">PDF Document - Click "View" to open</span>
                          </div>
                        )}
                      </div>
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
