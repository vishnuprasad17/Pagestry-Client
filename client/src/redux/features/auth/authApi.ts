import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './baseQuery';
import { API_ROUTES } from '../../../constants/apiRoutes';
import { AdminData, AdminLoginArgs, AdminLoginResponse, LogoutResponse, UserData, UserLoginArgs, UserLoginResponse } from '../../../types/auth';

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithAuth as BaseQueryFn,
    tagTypes: ['Auth', 'UserLogout', 'Admin', 'AdminLogout'],
    endpoints: (builder) => ({
        userLogin: builder.mutation<UserData, UserLoginArgs>({
            query: ({idToken}) => ({
                url: `/${API_ROUTES.AUTH}/sync-user`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            }),
            invalidatesTags: ['Auth'],
            transformResponse: (response: UserLoginResponse) => response.data
        }),
        adminLogin: builder.mutation<AdminData, AdminLoginArgs>({
            query: (credentials) => ({
                url: `/admin/${API_ROUTES.AUTH}/login`,
                method: "POST",
                body: credentials,
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
            invalidatesTags: ['Admin'],
            transformResponse: (response: AdminLoginResponse) => response.data
        }),
        userLogout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: `/${API_ROUTES.AUTH}/user/logout`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
            invalidatesTags: ['UserLogout']
        }),
        adminLogout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: `/admin/${API_ROUTES.AUTH}/logout`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
            invalidatesTags: ['AdminLogout']
        }),
    }),
});

export const { useUserLoginMutation, useAdminLoginMutation, useUserLogoutMutation, useAdminLogoutMutation } = authApi;
export default authApi;