import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define your API service
export const apiSlice = createApi({
    reducerPath: 'api', // Unique name for this API slice
    
    baseQuery: fetchBaseQuery({
        // baseUrl: 'https://jellyfish-app-whqao.ondigitalocean.app/', // Adjust the base URL as per your environment old
        // baseUrl: 'http://localhost:5000',
         baseUrl: 'https://api.internalops.pro/', // Replace with your actual base URL use
        mode: 'cors', // Ensuring CORS mode is set
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem("token") ?? getState().token; // Fetch token from auth state if exists
            if (token) {
                headers.set('authorization', `Bearer ${token}`); // Set authorization header if token exists
            }
            headers.set('Accept', '*/*'); // Accept any type of content
            headers.set('Content-Type', 'application/json'); // Ensure JSON format for request bodies
            return headers; // Return modified headers
        },
    }),

    tagTypes: ['Login', 'Department', "Employees", 'Roles', 'Request', 'Circular', 'Kpi', 'AIInsights', 'Recommendations', 'DailyReminder', 'ResourceUsage'],
    
    endpoints: (builder) => ({
        // Mutation for user login
        login: builder.mutation({
            query: (credentials) => ({
                url: 'api/auth/login', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Login'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        reqPasswordReset: builder.mutation({
            query: (credentials) => ({
                url: 'api/auth/reqPasswordReset', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Login'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        resetPassword: builder.mutation({
            query: (credentials) => ({
                url: 'api/auth/resetPassword', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Login'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        getData: builder.query({
            query: (token) => `api/data/stats`,
            // transformResponse: (response) => response.data,
            providesTags: ['Login']
        }),

        getProfile: builder.query({
            query: (token) => `api/users/profile`,
            // transformResponse: (response) => response.data,
            providesTags: ['Login']
        }),

        getDepartment: builder.query({
            query: (token) => `api/departments`,
            // transformResponse: (response) => response.data,
            providesTags: ['Department']
        }),

        getRole: builder.query({
            query: (token) => `api/roles`,
            // transformResponse: (response) => response.data,
            providesTags: ['Roles']
        }),

        getEmployee: builder.query({
            query: ({ limit, offset }) => `api/users?limit=${limit}&offset=${offset}`,
            // transformResponse: (response) => response.data,
            providesTags: ['Employees']
        }),

        getRequest: builder.query({
            query: (params) => ({
                url: `api/requests/filterby`,
                params
            }),
            // transformResponse: (response) => response.data,
            providesTags: ['Request']
        }),

        createDepartment: builder.mutation({
            query: (credentials) => ({
                url: 'api/departments', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Department'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        createRoles: builder.mutation({
            query: (credentials) => ({
                url: 'api/roles', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Roles'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        createEmployee: builder.mutation({
            query: (credentials) => ({
                url: '/api/users/register', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Employees'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        createRequest: builder.mutation({
            query: (credentials) => ({
                url: '/api/requests', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Request'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        getRequestID: builder.query({
            query: (id) => `api/requests/${id}`,
            // transformResponse: (response) => response.data,
            providesTags: ['Request']
        }),

        updateRequestStatus: builder.mutation({
            query: ({ id, status, comment }) => ({
                url: `api/requests/${id}/status`, // Endpoint URL
                method: 'PATCH',
                body: { status, comment }, // The request body containing the new status
            }),
            invalidatesTags: ['Request'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        createCircular: builder.mutation({
            query: (credentials) => ({
                url: '/api/circulars', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Circular'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        getUserDepartment: builder.query({
            query: (id) => `api/departments/${id}`,
            // transformResponse: (response) => response.data,
            providesTags: ['Department']
        }),

        getMyCircular: builder.query({
            query: () => '/api/circulars/my-circulars',
            // transformResponse: (response) => response.data,
            providesTags: ['Circular']
        }),

        getCircularID: builder.query({
            query: (id) => `api/circulars/${id}`,
            // transformResponse: (response) => response.data,
            providesTags: ['Circular']
        }),

        respondToCircular: builder.mutation({
            query: (credentials) => ({
                url: '/api/circulars/circular-response', // API endpoint for login
                method: 'POST', // HTTP method
                body: credentials, // Payload for the request
            }),
            invalidatesTags: ['Circular'], // Tag to invalidate, ensuring fresh data fetch if needed
        }),

        getResponseID: builder.query({
            query: (id) => `api/circulars/response/${id}`,
            // transformResponse: (response) => response.data,
            providesTags: ['Circular']
        }),

        getEveryEmployee: builder.query({
            query: () => '/api/users/employees',
            // transformResponse: (response) => response.data,
            providesTags: ['Employees']
        }),

        createKpi: builder.mutation({
            query: (credentials) => ({
                url: '/api/kpi', 
                method: 'POST',
                body: credentials, 
            }),
            invalidatesTags: ['Kpi'], 
        }),

        getKpiTemplates: builder.query({
            query: ({ search = '', departmentId = '', metricType = '', page = 1, limit = 10 }) => ({
                url: `/api/kpi/filterby`,
                params: { search, departmentId, metricType, page, limit },
            }),
            providesTags: ['Kpi'],
        }),

        updateTemplate: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/api/kpi/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Kpi'],
        }),

        deleteTemplate: builder.mutation({
            query: (id) => ({
                url: `/api/kpi/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Kpi'],
        }),

        getAccessibleUsers: builder.query({
            query: () => '/api/users/accessible-users',
            // transformResponse: (response) => response.data,
            providesTags: ['Employees']
        }),

        getAllKpiTemplates: builder.query({
            query: () => '/api/kpi',
            // transformResponse: (response) => response.data,
            providesTags: ['Kpi']
        }),

        assignKpi: builder.mutation({
            query: ({...updates }) => ({
                url: `/api/kpi/assign`,
                method: 'POST',
                body: updates,
            }),
            invalidatesTags: ['Kpi'],
        }),

        getKpiID: builder.query({
            query: (id) => `api/kpi/${id}`,
            // transformResponse: (response) => response.data,
            providesTags: ['Circular']
        }),

        getKpiDashboard: builder.query({
            query: ({ search = '', page = 1, limit = 10 }) => ({
                url: `/api/kpi/dashboard/details`,
                params: { search, page, limit },
            }),
            // transformResponse: (response) => response.data,
            providesTags: ['Kpi']
        }),

        getUserKpis: builder.query({
            query: (id) => `api/kpi/kpis/${id}`,
            // transformResponse: (response) => response.data,
            providesTags: ['Circular']
        }),

        getKpiDetails: builder.query({
            query: ({ userId, kpiAssignmentId }) => `api/kpi/${userId}/${kpiAssignmentId}/kpis`
        }),

        // Get AI insights for multiple KPIs
        getAIInsights: builder.query({
            query: ({userId, kpiAssignmentId}) => ({
                url: `api/feedback/kpi/${userId}/insights/${kpiAssignmentId}`,
            }),
            providesTags: ['AIInsights'],
        }),

        // Get AI recommendations
        getRecommendations: builder.query({
        query: ({ limit = 8 } = {}) => `api/feedback/recommendations?limit=${limit}`,
        providesTags: ['Recommendations'],
        transformResponse: (response) => response,
        }),

        // Get daily reminder
        getDailyReminder: builder.query({
        query: () => 'api/feedback/daily-reminder',
        providesTags: ['DailyReminder'],
        transformResponse: (response) => response,
        }),

        // Track resource usage (mutation)
        trackResourceUsage: builder.mutation({
        query: ({ resourceId, rating = null }) => ({
            url: `/ai/resource/${resourceId}/track`,
            method: 'POST',
            body: { rating },
        }),
        invalidatesTags: ['ResourceUsage', 'Recommendations'],
        }),

        // Additional endpoints you might need:

        // Get individual KPI insights
        getKPIInsights: builder.query({
        query: (kpiId) => `/ai/kpi/${kpiId}/insights`,
        providesTags: (result, error, kpiId) => [{ type: 'AIInsights', id: kpiId }],
        }),

        // Submit KPI report
        submitKPIReport: builder.mutation({
        query: ({ kpiId, reportData }) => ({
            url: `/kpi/${kpiId}/report`,
            method: 'POST',
            body: reportData,
        }),
        invalidatesTags: ['KPI', 'AIInsights'],
        }),

        // Update KPI progress
        updateKPIProgress: builder.mutation({
        query: ({ kpiId, progress, notes }) => ({
            url: `/kpi/${kpiId}/progress`,
            method: 'PUT',
            body: { progress, notes },
        }),
        invalidatesTags: ['KPI', 'AIInsights'],
        }),

        // Get performance analytics
        getPerformanceAnalytics: builder.query({
        query: ({ startDate, endDate, kpiIds } = {}) => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (kpiIds?.length) params.append('kpiIds', kpiIds.join(','));
            
            return `/analytics/performance?${params.toString()}`;
        },
        providesTags: ['KPI'],
        }),

        // Rate a learning resource
        rateResource: builder.mutation({
        query: ({ resourceId, rating, feedback }) => ({
            url: `/ai/resource/${resourceId}/rate`,
            method: 'POST',
            body: { rating, feedback },
        }),
        invalidatesTags: ['Recommendations', 'ResourceUsage'],
        }),

        // Get user's learning progress
        getLearningProgress: builder.query({
        query: () => '/ai/learning/progress',
        providesTags: ['ResourceUsage'],
        }),

        // Request new AI recommendations
        requestNewRecommendations: builder.mutation({
        query: ({ skills, interests, currentKPIs } = {}) => ({
            url: '/ai/recommendations/generate',
            method: 'POST',
            body: { skills, interests, currentKPIs },
        }),
        invalidatesTags: ['Recommendations'],
        }),

        // Get manager feedback
        getManagerFeedback: builder.query({
        query: ({ limit = 10 } = {}) => `/feedback/manager?limit=${limit}`,
        providesTags: ['Feedback'],
        }),

        // Submit feedback request
        submitFeedbackRequest: builder.mutation({
        query: ({ managerId, message, kpiId }) => ({
            url: '/feedback/request',
            method: 'POST',
            body: { managerId, message, kpiId },
        }),
        invalidatesTags: ['Feedback'],
        }),
    }),
});

// Export hooks for usage in functional components
export const { useLoginMutation, useGetDataQuery, useGetProfileQuery, useGetDepartmentQuery, useGetRoleQuery, useGetEmployeeQuery, useCreateDepartmentMutation, useCreateRolesMutation, useCreateEmployeeMutation, useGetRequestQuery, useCreateRequestMutation, useGetRequestIDQuery,useUpdateRequestStatusMutation, useReqPasswordResetMutation, useResetPasswordMutation, useCreateCircularMutation, useGetUserDepartmentQuery, useGetMyCircularQuery, useGetCircularIDQuery, useRespondToCircularMutation, useGetResponseIDQuery, useGetEveryEmployeeQuery, useCreateKpiMutation, useGetKpiTemplatesQuery, useUpdateTemplateMutation, useDeleteTemplateMutation, useGetAccessibleUsersQuery, useGetAllKpiTemplatesQuery, useAssignKpiMutation, useGetKpiIDQuery, useGetKpiDashboardQuery, useGetUserKpisQuery, useGetKpiDetailsQuery, useGetAIInsightsQuery, useGetRecommendationsQuery, useGetDailyReminderQuery, useTrackResourceUsageMutation, useGetKPIInsightsQuery, useSubmitKPIReportMutation, useUpdateKPIProgressMutation, useGetPerformanceAnalyticsQuery, useRateResourceMutation, useGetLearningProgressQuery, useRequestNewRecommendationsMutation, useGetManagerFeedbackQuery, useSubmitFeedbackRequestMutation } = apiSlice;
