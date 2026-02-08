import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../auth/baseQuery";
import { API_ROUTES } from "../../../constants/apiRoutes";
import { CancelOrderArgs, CancelOrderResponse, CreateOrderArgs, CreateOrderResponse, GetOrdersResponse, GetRazorpayKeyResponse, GetSingleOrderResponse, OrderResponse, PaginatedOrderData, RazorpayKeyData, VerifyPayment, VerifyPaymentArgs, VerifyPaymentResponse } from "../../../types/order";


const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithAuth as BaseQueryFn,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation<CreateOrderResponse, CreateOrderArgs>({
            query: (newOrder) => ({
                url: `/${API_ROUTES.ORDERS}`,
                method: "POST",
                body: newOrder,
                credentials: 'include',
            }),
            invalidatesTags: ['Orders']
        }),
        getOrders: builder.query<PaginatedOrderData, number>({
            query: (page) => ({
                url: `/${API_ROUTES.ORDERS}/my-orders`,
                params: {page, limit: 5}
            }),
            providesTags: ['Orders'],
            transformResponse: (response: GetOrdersResponse) => response.data,
        }),
        getSingleOrder: builder.query<OrderResponse, string>({
            query: (orderId) => ({
                url: `/${API_ROUTES.ORDERS}/${orderId}`
            }),
            transformResponse: (response: GetSingleOrderResponse) => response.data,
        }),
        getRazorpayConfig: builder.query<RazorpayKeyData, void>({
            query: () => ({
                url: `/${API_ROUTES.ORDERS}/config/razorpay`
            }),
            transformResponse: (response: GetRazorpayKeyResponse) => response.data
        }),
        verifyPayment: builder.mutation<VerifyPayment, VerifyPaymentArgs>({
            query: (data) => ({
                url: `/${API_ROUTES.ORDERS}/verify-payment`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Orders'],
            transformResponse: (response: VerifyPaymentResponse) => response.data
        }),
        cancelOrder: builder.mutation<CancelOrderResponse, CancelOrderArgs>({
            query: ({orderId, reason}) => ({
                url: `/${API_ROUTES.ORDERS}/${orderId}/cancel`,
                method: "PATCH",
                body: {reason}
            }),
            invalidatesTags: ['Orders']
        })
    })
});

export const {
    useCreateOrderMutation,
    useGetOrdersQuery,
    useGetSingleOrderQuery,
    useGetRazorpayConfigQuery,
    useVerifyPaymentMutation,
    useCancelOrderMutation
} = orderApi;

export default orderApi;