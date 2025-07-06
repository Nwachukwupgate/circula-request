import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define your API service
export const apiSlice = createApi({
    reducerPath: 'api', // Unique name for this API slice
    
    baseQuery: fetchBaseQuery({
        // baseUrl: 'https://jellyfish-app-whqao.ondigitalocean.app/', // Adjust the base URL as per your environment old
        baseUrl: 'http://localhost:5000',
        // baseUrl: 'https://demo.xylon.pro/', // Replace with your actual base URL use
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

    tagTypes: ['Login', 'Department', "Employees", 'Roles', 'Request', 'Circular'], // Tags used for cache invalidation and refetching data
    
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
    }),
});

// Export hooks for usage in functional components
export const { useLoginMutation, useGetDataQuery, useGetProfileQuery, useGetDepartmentQuery, useGetRoleQuery, useGetEmployeeQuery, useCreateDepartmentMutation, useCreateRolesMutation, useCreateEmployeeMutation, useGetRequestQuery, useCreateRequestMutation, useGetRequestIDQuery,useUpdateRequestStatusMutation, useReqPasswordResetMutation, useResetPasswordMutation, useCreateCircularMutation, useGetUserDepartmentQuery, useGetMyCircularQuery, useGetCircularIDQuery, useRespondToCircularMutation, useGetResponseIDQuery, useGetEveryEmployeeQuery } = apiSlice;