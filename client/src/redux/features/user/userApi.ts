import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../auth/baseQuery';
import { API_ROUTES } from '../../../constants/apiRoutes';
import { CloudinarySignatureArgs, CloudinarySignatureResponse, GetUserResponse, GetWishListResponse, UpdateUserArgs, UpdateUserResponse, UserData, WishListArgs, WishlistData, WishListResponse } from '../../../types/user';

const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithAuth as BaseQueryFn,
    tagTypes: ['User', 'WishList', 'Auth'],
    endpoints: (builder) => ({
        getUser: builder.query<UserData, void>({
            query: () => `/${API_ROUTES.USER}/me`,
            providesTags: ['User'],
            transformResponse: (response: GetUserResponse) => response.data
        }),
        updateUser: builder.mutation<UpdateUserResponse, UpdateUserArgs>({
            query: ({ userId, data }) => ({
                url: `/${API_ROUTES.USER}/edit-user/${userId}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        addToWishList: builder.mutation<WishListResponse, WishListArgs>({
            query: ({ userId, bookId }) => ({
                url: `/${API_ROUTES.USER}/wishlist/${userId}/${bookId}`,
                method: 'POST',
            }),
            invalidatesTags: ['WishList']
        }),
        removeFromWishList: builder.mutation<WishListResponse, WishListArgs>({
            query: ({ userId, bookId }) => ({
                url: `/${API_ROUTES.USER}/wishlist/${userId}/${bookId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WishList']
        }),
        fetchWishList: builder.query<WishlistData[], string>({
            query: (userId) => `/${API_ROUTES.USER}/wishlist/${userId}`,
            providesTags: ['WishList'],
            transformResponse: (response: GetWishListResponse) => response.data
        }),
        getCloudinarySignature: builder.mutation<CloudinarySignatureResponse, CloudinarySignatureArgs>({
            query: (body) => ({
                url: `/${API_ROUTES.USER}/cloudinary-signature`,
                method: "POST",
                body
            }),
        })
    }),
});

export const { useGetUserQuery, useUpdateUserMutation, useAddToWishListMutation, useRemoveFromWishListMutation, useFetchWishListQuery, useGetCloudinarySignatureMutation } = userApi;
export default userApi;