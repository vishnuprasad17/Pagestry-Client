import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../auth/baseQuery';
import { API_ROUTES } from '../../../constants/apiRoutes';
import { CartData, ClearCartResponse, GetCartResponse, MergeCartArgs, MergeCartResponse, RemoveCartItemArgs, RemoveCartItemResponse, UpdateCartArgs, UpdateCartResponse, ValidateCartArgs, ValidateCartResponse } from '../../../types/cart';

const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: baseQueryWithAuth as BaseQueryFn,
    tagTypes: ['Cart'],

    endpoints: (builder) =>({
        getCart: builder.query<CartData[], string>({
            query: (userId) => `/${API_ROUTES.CART}/${userId}`,
            providesTags: ["Cart"],
            transformResponse: (response: GetCartResponse) => response.data
        }),
        mergeCart: builder.mutation<MergeCartResponse, MergeCartArgs>({
            query: ({userId,items}) => ({
                url: `/${API_ROUTES.CART}/merge/${userId}`,
                method: "POST",
                body: {items},
            }),
            invalidatesTags: ["Cart"]
        }),
        updateCartQty: builder.mutation<UpdateCartResponse, UpdateCartArgs>({
            query: ({userId, bookId, quantity}) => ({
                url: `/${API_ROUTES.CART}/update/${userId}`,
                method: "PATCH",
                body: {bookId, quantity}
            }),
            invalidatesTags: ["Cart"]
        }),
        removeCartItem: builder.mutation<RemoveCartItemResponse, RemoveCartItemArgs>({
            query: ({userId, bookId}) => ({
                url: `/${API_ROUTES.CART}/update/${userId}/${bookId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        }),
        validateCart: builder.mutation<ValidateCartResponse, ValidateCartArgs[]>({
            query: (items) => ({
                url: `/${API_ROUTES.CART}/validate`,
                method: "POST",
                body: {items}
            }),
            invalidatesTags: ["Cart"]
        }),
        clearCart: builder.mutation<ClearCartResponse, string>({
            query: (userId) => ({
                url: `/${API_ROUTES.CART}/clear/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        }),
    })
});

export const { useGetCartQuery, useMergeCartMutation, useUpdateCartQtyMutation, useRemoveCartItemMutation, useValidateCartMutation, useClearCartMutation } = cartApi;

export default cartApi;