import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../auth/baseQuery";
import { API_ROUTES } from "../../../constants/apiRoutes";
import { AddressData, CreateAddressArgs, CreateAddressResponse, DeleteAddressResponse, FetchAddressesResponse, FetchAddressResponse, MakeAddressDefaultArgs, MakeAddressDefaultResponse, UpdateAddressArgs, UpdateAddressResponse } from "../../../types/address";

const addressApi = createApi({
    reducerPath: "addressApi",
    baseQuery: baseQueryWithAuth as BaseQueryFn,
    tagTypes: ["Address"],
    endpoints: (builder) => ({
        fetchAddresses: builder.query<AddressData[], string>({
            query: (userId) => ({
                url: `${API_ROUTES.ADDRESS}/`,
                params: { userId },
                method: "GET",
            }),
            providesTags: ["Address"],
            transformResponse: (response: FetchAddressesResponse) => response.data,
        }),
        fetchAddress: builder.query<AddressData, string>({
            query: (id) => ({
                url: `${API_ROUTES.ADDRESS}/${id}`,
                method: "GET",
            }),
            providesTags: ["Address"],
            transformResponse: (response: FetchAddressResponse) => response.data,
        }),
        createAddress: builder.mutation<CreateAddressResponse, CreateAddressArgs>({
            query: (address) => ({
                url: `${API_ROUTES.ADDRESS}/add-address`,
                method: "POST",
                body: address,
            }),
            invalidatesTags: ["Address"],
        }),
        updateAddress: builder.mutation<UpdateAddressResponse, UpdateAddressArgs>({
            query: ({ id, address }) => ({
                url: `${API_ROUTES.ADDRESS}/update-address/${id}`,
                method: "PUT",
                body: address,
            }),
            invalidatesTags: ["Address"],
        }),
        makeDefault: builder.mutation<MakeAddressDefaultResponse, MakeAddressDefaultArgs>({
            query: ({id, userId}) => ({
                url: `${API_ROUTES.ADDRESS}/${id}/make-default`,
                method: "PATCH",
                body: {userId},
            }),
            invalidatesTags: ["Address"],
        }),
        deleteAddress: builder.mutation<DeleteAddressResponse, string>({
            query: (id) => ({
                url: `${API_ROUTES.ADDRESS}/delete-address/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Address"],
        })
    }),
});

export const { useFetchAddressesQuery, useFetchAddressQuery, useCreateAddressMutation, useUpdateAddressMutation, useMakeDefaultMutation, useDeleteAddressMutation } = addressApi;

export default addressApi;