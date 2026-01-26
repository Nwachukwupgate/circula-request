import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
    getAccessToken, 
    getRefreshToken, 
    setTokens, 
    clearTokens,
    getIsRefreshing,
    setRefreshing,
    subscribeToRefresh,
    onRefreshSuccess,
    onRefreshFailure
} from '../utils/tokenManager';

// Base URL configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create base query with auth headers
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    mode: 'cors',
    prepareHeaders: (headers, { getState, endpoint, extra }) => {
        const token = getAccessToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('Accept', '*/*');
        return headers;
    },
});

// Public routes that should not trigger auth redirects
const PUBLIC_PATHS = ['/authentication/sign-in', '/authentication/reset-password', '/change-password'];

// Check if we're on a public route
const isPublicRoute = () => {
    if (typeof window !== 'undefined') {
        return PUBLIC_PATHS.some(path => window.location.pathname.startsWith(path));
    }
    return false;
};

// Custom base query with automatic token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // Skip auth logic for login endpoint
    const url = typeof args === 'string' ? args : args?.url;
    if (url?.includes('api/auth/login') || url?.includes('api/auth/reqPasswordReset') || url?.includes('api/auth/resetPassword')) {
        return await baseQuery(args, api, extraOptions);
    }

    // First, try the request with current token
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 error, try to refresh the token
    if (result?.error?.status === 401) {
        // Don't try to refresh or redirect if we're on a public route
        if (isPublicRoute()) {
            return result;
        }

        const errorCode = result?.error?.data?.code;
        
        // Only try to refresh if token is expired (not if it's invalid or missing)
        if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'NO_TOKEN') {
            const refreshToken = getRefreshToken();
            
            if (refreshToken) {
                // Check if we're already refreshing
                if (!getIsRefreshing()) {
                    setRefreshing(true);
                    
                    try {
                        // Try to refresh the token
                        const refreshResult = await baseQuery(
                            {
                                url: 'api/auth/refresh-token',
                                method: 'POST',
                                body: { refreshToken }
                            },
                            api,
                            extraOptions
                        );

                        if (refreshResult?.data) {
                            // Store new tokens
                            const { accessToken, refreshToken: newRefreshToken, expiresIn, user } = refreshResult.data;
                            setTokens(accessToken, newRefreshToken, user, expiresIn);
                            
                            // Notify all subscribers
                            onRefreshSuccess(accessToken);
                            
                            // Retry the original request with new token
                            result = await baseQuery(args, api, extraOptions);
                        } else {
                            // Refresh failed - clear tokens
                            onRefreshFailure(refreshResult?.error);
                            clearTokens();
                            
                            // Only redirect if not already on login page
                            if (typeof window !== 'undefined' && !isPublicRoute()) {
                                window.location.href = '/authentication/sign-in';
                            }
                        }
                    } finally {
                        setRefreshing(false);
                    }
                } else {
                    // Another request is already refreshing, wait for it
                    return new Promise((resolve) => {
                        subscribeToRefresh(async (newToken, error) => {
                            if (newToken) {
                                // Retry with new token
                                const retryResult = await baseQuery(args, api, extraOptions);
                                resolve(retryResult);
                            } else {
                                resolve(result);
                            }
                        });
                    });
                }
            } else {
                // No refresh token available - clear tokens
                clearTokens();
                // Only redirect if not already on login page
                if (typeof window !== 'undefined' && !isPublicRoute()) {
                    window.location.href = '/authentication/sign-in';
                }
            }
        }
    }

    return result;
};

// Define your API service
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Login', 'Department', "Employees", 'Roles', 'Request', 'Circular', 'Kpi', 'AIInsights', 'Recommendations', 'DailyReminder', 'ResourceUsage', 'Notifications', 'Profile', 'Settings', 'Sessions'],
    
    endpoints: (builder) => ({
        // Mutation for user login
        login: builder.mutation({
            query: (credentials) => ({
                url: 'api/auth/login',
                method: 'POST',
                body: credentials,
            }),
            // Handle login response to store tokens
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.accessToken) {
                        setTokens(data.accessToken, data.refreshToken, data.user, data.expiresIn);
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
            invalidatesTags: ['Login'],
        }),

        // Refresh token endpoint
        refreshToken: builder.mutation({
            query: (refreshToken) => ({
                url: 'api/auth/refresh-token',
                method: 'POST',
                body: { refreshToken },
            }),
        }),

        // Logout endpoint
        logout: builder.mutation({
            query: () => {
                const refreshToken = getRefreshToken();
                return {
                    url: 'api/auth/logout',
                    method: 'POST',
                    body: { refreshToken },
                };
            },
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    // Always clear tokens, even if logout request fails
                    clearTokens();
                }
            },
            invalidatesTags: ['Login', 'Profile'],
        }),

        // Logout from all devices
        logoutAll: builder.mutation({
            query: () => ({
                url: 'api/auth/logout-all',
                method: 'POST',
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    clearTokens();
                }
            },
            invalidatesTags: ['Login', 'Profile', 'Sessions'],
        }),

        // Get active sessions
        getActiveSessions: builder.query({
            query: () => 'api/auth/sessions',
            providesTags: ['Sessions'],
        }),

        // Revoke a specific session
        revokeSession: builder.mutation({
            query: (sessionId) => ({
                url: `api/auth/sessions/${sessionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Sessions'],
        }),

        // Verify token validity
        verifyToken: builder.query({
            query: () => 'api/auth/verify',
            providesTags: ['Login'],
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
            providesTags: ['Profile', 'Login']
        }),

        // Update user profile
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: 'api/users/profile',
                method: 'PUT',
                body: profileData,
            }),
            invalidatesTags: ['Profile', 'Login'],
        }),

        // Upload profile image
        uploadProfileImage: builder.mutation({
            query: ({ image }) => ({
                url: 'api/users/profile/upload-image',
                method: 'POST',
                body: { image },
            }),
            invalidatesTags: ['Profile', 'Login'],
        }),

        // Get user settings
        getUserSettings: builder.query({
            query: () => 'api/users/settings',
            providesTags: ['Settings'],
        }),

        // Update user settings
        updateUserSettings: builder.mutation({
            query: (settings) => ({
                url: 'api/users/settings',
                method: 'PUT',
                body: { settings },
            }),
            invalidatesTags: ['Settings'],
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
            query: (formData) => ({
                url: '/api/users/register',
                method: 'POST',
                body: formData,
                // Don't set Content-Type header - browser will set it automatically with boundary for FormData
                formData: true,
            }),
            invalidatesTags: ['Employees'],
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
            providesTags: ['Kpi']
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
            providesTags: ['Kpi']
        }),

        getMyKpis: builder.query({
            query: () => `api/kpi/my/kpis`,
            // transformResponse: (response) => response.data,
            providesTags: ['Kpi']
        }),

        getKpiDetails: builder.query({
            query: ({ userId, kpiAssignmentId }) => `api/kpi/${userId}/${kpiAssignmentId}/kpis`,
            providesTags: ['Kpi']
        }),

        getMyKpiDetails: builder.query({
            query: ({ kpiAssignmentId }) => `api/kpi/${kpiAssignmentId}/kpis`,
            providesTags: ['Kpi']
        }),

        // Get AI insights for multiple KPIs
        getAIInsights: builder.query({
            query: ({userId, kpiAssignmentId}) => ({
                url: `api/feedback/kpi/${userId}/insights/${kpiAssignmentId}`,
            }),
            providesTags: ['AIInsights', 'Kpi'],
        }),

        getMyAIInsights: builder.query({
            query: ({ kpiAssignmentId }) => ({
                url: `api/feedback/my-kpi/insights/${kpiAssignmentId}`,
            }),
            providesTags: ['AIInsights', 'Kpi'],
        }),

        // Get AI recommendations
        getRecommendations: builder.query({
            query: ({ limit = 8 } = {}) => `api/feedback/recommendations?limit=${limit}`,
            providesTags: ['Recommendations', 'Kpi'],
            transformResponse: (response) => response,
        }),

        // Get Growth Library resources
        getGrowthLibraryResources: builder.query({
            query: ({ search = '', type = 'all', category = '', limit = 20 } = {}) => {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (type && type !== 'all') params.append('type', type);
                if (category) params.append('category', category);
                params.append('limit', limit);
                return `api/feedback/growth-library?${params.toString()}`;
            },
            providesTags: ['GrowthLibrary', 'Recommendations', 'Kpi'],
        }),

        // Get daily reminder
        getDailyReminder: builder.query({
            query: () => 'api/feedback/daily-reminder',
            providesTags: ['DailyReminder', 'Kpi'],
            transformResponse: (response) => response,
        }),

        // Track resource usage (mutation)
        trackResourceUsage: builder.mutation({
        query: ({ resourceId, rating = null }) => ({
            url: `/ai/resource/${resourceId}/track`,
            method: 'POST',
            body: { rating },
        }),
        invalidatesTags: ['ResourceUsage', 'Recommendations', 'Kpi'],
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
        invalidatesTags: ['Kpi', 'AIInsights'],
        }),

        // Update KPI progress
        updateKPIProgress: builder.mutation({
        query: ({ kpiId, progress, notes }) => ({
            url: `/kpi/${kpiId}/progress`,
            method: 'PUT',
            body: { progress, notes },
        }),
        invalidatesTags: ['Kpi', 'AIInsights'],
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
        providesTags: ['Kpi'],
        }),

        // Rate a learning resource
        rateResource: builder.mutation({
        query: ({ resourceId, rating, feedback }) => ({
            url: `/ai/resource/${resourceId}/rate`,
            method: 'POST',
            body: { rating, feedback },
        }),
        invalidatesTags: ['Recommendations', 'ResourceUsage', 'Kpi'],
        }),

        // Get user's learning progress
        getLearningProgress: builder.query({
        query: () => '/ai/learning/progress',
        providesTags: ['ResourceUsage', 'Kpi'],
        }),

        // Request new AI recommendations
        requestNewRecommendations: builder.mutation({
        query: ({ skills, interests, currentKPIs } = {}) => ({
            url: '/ai/recommendations/generate',
            method: 'POST',
            body: { skills, interests, currentKPIs },
        }),
        invalidatesTags: ['Recommendations', 'Kpi'],
        }),

        // Get manager feedback
        getManagerFeedback: builder.query({
        query: ({ limit = 10 } = {}) => `/feedback/manager?limit=${limit}`,
        providesTags: ['Feedback', 'Kpi'],
        }),

        // Submit feedback request
        submitFeedbackRequest: builder.mutation({
        query: ({ managerId, message, kpiId }) => ({
            url: '/feedback/request',
            method: 'POST',
            body: { managerId, message, kpiId },
        }),
        invalidatesTags: ['Feedback, Kpi'],
        }),

        createKpiReport: builder.mutation({query: (reportData) => ({
            url: 'api/feedback/kpi/create/kpireports',
            method: 'POST',
            body: reportData,
        }), 
        invalidatesTags: ['Kpi', 'AIInsights'],
        }),

        // Quick Actions - Set Milestone
        setMilestone: builder.mutation({
            query: ({ kpiAssignmentId, milestoneValue, milestoneNote, milestoneDate }) => ({
                url: `api/kpi/${kpiAssignmentId}/milestone`,
                method: 'POST',
                body: { milestoneValue, milestoneNote, milestoneDate },
            }),
            invalidatesTags: ['Kpi'],
        }),

        // Quick Actions - Request Feedback
        requestKpiFeedback: builder.mutation({
            query: ({ kpiAssignmentId, message }) => ({
                url: `api/kpi/${kpiAssignmentId}/request-feedback`,
                method: 'POST',
                body: { message },
            }),
            invalidatesTags: ['Kpi', 'Feedback'],
        }),

        // Quick Actions - Get Performance History
        getPerformanceHistory: builder.query({
            query: (kpiAssignmentId) => `api/kpi/${kpiAssignmentId}/performance-history`,
            providesTags: ['Kpi'],
        }),

        // Manager Feedback - Submit Remark
        submitManagerRemark: builder.mutation({
            query: ({ kpiAssignmentId, comment, recommendation, rating }) => ({
                url: `api/feedback/kpi/${kpiAssignmentId}/remark`,
                method: 'POST',
                body: { comment, recommendation, rating },
            }),
            invalidatesTags: ['Kpi', 'Feedback'],
        }),

        // Get Feedback History for a KPI assignment
        getKpiFeedbackHistory: builder.query({
            query: (kpiAssignmentId) => `api/feedback/kpi/${kpiAssignmentId}/history`,
            providesTags: ['Kpi', 'Feedback'],
        }),

        // Reply to a staff's feedback request
        replyToFeedbackRequest: builder.mutation({
            query: ({ feedbackId, reply, recommendation }) => ({
                url: `api/feedback/reply/${feedbackId}`,
                method: 'PUT',
                body: { reply, recommendation },
            }),
            invalidatesTags: ['Kpi', 'Feedback'],
        }),

        // ========== NOTIFICATION ENDPOINTS ==========
        
        // Get all notifications for the logged-in user
        getNotifications: builder.query({
            query: ({ limit = 20, offset = 0, unreadOnly = false } = {}) => {
                const params = new URLSearchParams();
                params.append('limit', limit);
                params.append('offset', offset);
                if (unreadOnly) params.append('unreadOnly', 'true');
                return `api/notifications?${params.toString()}`;
            },
            providesTags: ['Notifications'],
        }),

        // Get unread notification count
        getUnreadNotificationCount: builder.query({
            query: () => 'api/notifications/unread-count',
            providesTags: ['Notifications'],
        }),

        // Mark a notification as read
        markNotificationAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `api/notifications/${notificationId}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notifications'],
        }),

        // Mark all notifications as read
        markAllNotificationsAsRead: builder.mutation({
            query: () => ({
                url: 'api/notifications/mark-all-read',
                method: 'PATCH',
            }),
            invalidatesTags: ['Notifications'],
        }),

        // Delete a notification
        deleteNotification: builder.mutation({
            query: (notificationId) => ({
                url: `api/notifications/${notificationId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notifications'],
        }),

        // Clear all read notifications
        clearReadNotifications: builder.mutation({
            query: () => ({
                url: 'api/notifications/clear-read',
                method: 'DELETE',
            }),
            invalidatesTags: ['Notifications'],
        }),

    }),
});

// Export hooks for usage in functional components
export const { 
    useLoginMutation, 
    useGetDataQuery, 
    useGetProfileQuery, 
    useGetDepartmentQuery, 
    useGetRoleQuery, 
    useGetEmployeeQuery, 
    useCreateDepartmentMutation, 
    useCreateRolesMutation, 
    useCreateEmployeeMutation, 
    useGetRequestQuery, 
    useCreateRequestMutation, 
    useGetRequestIDQuery,
    useUpdateRequestStatusMutation, 
    useReqPasswordResetMutation, 
    useResetPasswordMutation, 
    useCreateCircularMutation, 
    useGetUserDepartmentQuery, 
    useGetMyCircularQuery, 
    useGetCircularIDQuery, 
    useRespondToCircularMutation, 
    useGetResponseIDQuery, 
    useGetEveryEmployeeQuery, 
    useCreateKpiMutation, 
    useGetKpiTemplatesQuery, 
    useUpdateTemplateMutation, 
    useDeleteTemplateMutation, 
    useGetAccessibleUsersQuery, 
    useGetAllKpiTemplatesQuery, 
    useAssignKpiMutation, 
    useGetKpiIDQuery, 
    useGetKpiDashboardQuery, 
    useGetUserKpisQuery, 
    useGetKpiDetailsQuery, 
    useGetAIInsightsQuery, 
    useGetRecommendationsQuery, 
    useGetDailyReminderQuery, 
    useTrackResourceUsageMutation, 
    useGetKPIInsightsQuery, 
    useSubmitKPIReportMutation, 
    useUpdateKPIProgressMutation, 
    useGetPerformanceAnalyticsQuery, 
    useRateResourceMutation, 
    useGetLearningProgressQuery, 
    useRequestNewRecommendationsMutation, 
    useGetManagerFeedbackQuery, 
    useSubmitFeedbackRequestMutation, 
    useGetMyKpisQuery, 
    useGetMyKpiDetailsQuery, 
    useCreateKpiReportMutation, 
    useGetMyAIInsightsQuery, 
    useSetMilestoneMutation, 
    useRequestKpiFeedbackMutation, 
    useGetPerformanceHistoryQuery, 
    useSubmitManagerRemarkMutation, 
    useGetKpiFeedbackHistoryQuery, 
    useReplyToFeedbackRequestMutation, 
    useGetGrowthLibraryResourcesQuery,
    // Notification hooks
    useGetNotificationsQuery,
    useGetUnreadNotificationCountQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useDeleteNotificationMutation,
    useClearReadNotificationsMutation,
    // Profile hooks
    useUpdateProfileMutation,
    useUploadProfileImageMutation,
    useGetUserSettingsQuery,
    useUpdateUserSettingsMutation,
    // Auth hooks
    useRefreshTokenMutation,
    useLogoutMutation,
    useLogoutAllMutation,
    useGetActiveSessionsQuery,
    useRevokeSessionMutation,
    useVerifyTokenQuery
} = apiSlice;
