import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../auth/baseQuery";
import { API_ROUTES } from "../../../constants/apiRoutes";
import { AddBookArgs, AddBookResponse, AdminStats, AuditLogsArgs, AuditLogsResponse, AuthorListItemDto, AuthorResponseDto, BannersArgs, BannersResponse, BlockUserResponse, BookResponseDto, CategoriesResponse, CloudinarySignatureArgs, CloudinarySignatureResponse, CreateAuthorArgs, CreateAuthorResponse, CreateBannerArgs, CreateBannerResponse, CreateCategoryArgs, CreateCategoryResponse, DailyReport, DailyReportResponse, DeleteAuthorResponse, DeleteBannerResponse, DeleteBookResponse, DeleteCategoryResponse, ExportOrdersArgs, GetAllAuthorsResponse, GetAllOrdersArgs, GetAllOrdersResponse, GetAllUsersArgs, GetAllUsersResponse, GetBookResponse, GetBooksArgs, GetBooksResponse, GetFilteredAuthorsArgs, GetFilteredAuthorsResponse, GetSingleAuthorResponse, MonthlyRevenueDto, MonthlyRevenueResponse, OrderResponse, OrderResponseDto, OrderStatsResponse, PaginatedAuditLogsDto, PaginatedAuthorsDto, PaginatedBannersDto, PaginatedBooksDto, PaginatedOrdersDto, PaginatedUsersDto, ProcessRefundArgs, ProcessRefundResponse, RevenueAnalyticsArgs, RevenueAnalyticsDto, RevenueAnalyticsResponse, UnblockUserResponse, UpdateAuthorArgs, UpdateBannerArgs, UpdateBannerResponse, UpdateBannerStatusArgs, UpdateBannerStatusResponse, UpdateBookArgs, UpdateBookResponse, UpdateCategoryArgs, UpdateCategoryResponse, UpdateDeliveryDetailsArgs, UpdateDeliveryDetailsResponse, UpdateOrderStatusArgs, UpdateOrderStatusResponse, YearlyRevenueDto, YearlyRevenueResponse } from "../../../types/admin";
import { CategoryData } from "../../../types/category";

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["AdminOrders", "OrderStats", "Revenue", "Category", "Books", "Authors", "Banners", "Users", "AuditLogs"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<PaginatedOrdersDto, GetAllOrdersArgs>({
      query: ({ page = 1, limit = 20, search = "", status = "", paymentStatus = "", paymentMethod = "", startDate = "", endDate = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (paymentStatus) params.append("paymentStatus", paymentStatus);
        if (paymentMethod) params.append("paymentMethod", paymentMethod);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        
        return `/${API_ROUTES.ADMIN}/orders?${params.toString()}`;
      },
      providesTags: ["AdminOrders"],
      transformResponse: (response: GetAllOrdersResponse) => response.data,
    }),
    getOrderStats: builder.query<AdminStats, void>({
      query: () => `/${API_ROUTES.ADMIN}/stats`,
      providesTags: ["OrderStats"],
      transformResponse: (response: OrderStatsResponse) => response.data,
    }),
    getOrderById: builder.query<OrderResponseDto, string>({
      query: (orderId) => `/${API_ROUTES.ADMIN}/orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "AdminOrders", id: orderId }],
      transformResponse: (response: OrderResponse) => response.data,
    }),
    updateOrderStatus: builder.mutation<UpdateOrderStatusResponse, UpdateOrderStatusArgs>({
      query: ({ orderId, status }) => ({
        url: `/${API_ROUTES.ADMIN}/status/${orderId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdminOrders", "OrderStats"],
    }),
    updateDeliveryDetails: builder.mutation<UpdateDeliveryDetailsResponse, UpdateDeliveryDetailsArgs>({
      query: ({ orderId, deliveryDetails }) => ({
        url: `/${API_ROUTES.ADMIN}/delivery/${orderId}`,
        method: "PATCH",
        body: deliveryDetails,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        "AdminOrders",
        { type: "AdminOrders", id: orderId },
      ],
    }),
    getRevenueAnalytics: builder.query<RevenueAnalyticsDto, RevenueAnalyticsArgs>({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `/${API_ROUTES.ADMIN}/analytics/revenue?${params.toString()}`;
      },
      transformResponse: (response: RevenueAnalyticsResponse) => response.data,
    }),
    getDailyReport: builder.query<DailyReport, string>({
      query: (date) => {
        const params = new URLSearchParams();
        if (date) params.append("date", date);
        return `/${API_ROUTES.ADMIN}/report/daily?${params.toString()}`;
      },
      transformResponse: (response: DailyReportResponse) => response.data,
    }),
    processRefund: builder.mutation<ProcessRefundResponse, ProcessRefundArgs>({
      query: ({ orderId, amount, reason }) => ({
        url: `/${API_ROUTES.ADMIN}/refund/${orderId}`,
        method: "POST",
        body: { amount, reason },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        "AdminOrders",
        { type: "AdminOrders", id: orderId },
        "OrderStats",
      ],
    }),
    fetchMonthlyRevenue: builder.query<MonthlyRevenueDto, number>({
      query: (year) => ({
        url: `/${API_ROUTES.ADMIN}/revenue/monthly`,
        params: year ? { year } : {},
      }),
      providesTags: ["Revenue"],
      transformResponse: (response: MonthlyRevenueResponse) => response.data,
    }),
    fetchYearlyRevenue: builder.query<YearlyRevenueDto, void>({
      query: () => `/${API_ROUTES.ADMIN}/revenue/yearly`,
      providesTags: ["Revenue"],
      transformResponse: (response: YearlyRevenueResponse) => response.data,
    }),
    exportOrdersCsv: builder.mutation<string, ExportOrdersArgs>({
      query: ({status, paymentStatus, startDate, endDate}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (paymentStatus) params.append("paymentStatus", paymentStatus);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return {
          url: `/${API_ROUTES.ADMIN}/export?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),
    fetchCategories: builder.query<CategoryData[], void>({
      query: () => `/${API_ROUTES.ADMIN}/categories`,
      providesTags: ["Category"],
      transformResponse: (response: CategoriesResponse) => response.data,
    }),
    createCategory: builder.mutation<CreateCategoryResponse, CreateCategoryArgs>({
      query: (newCategory) => ({
        url: `/${API_ROUTES.ADMIN}/categories/add-category`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<UpdateCategoryResponse, UpdateCategoryArgs>({
      query: ({ id, data }) => ({
        url: `/${API_ROUTES.ADMIN}/categories/edit-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<DeleteCategoryResponse, string>({
      query: (id) => ({
        url: `/${API_ROUTES.ADMIN}/categories/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    fetchBooks: builder.query<PaginatedBooksDto, GetBooksArgs>({
      query: ({ page, category, sort, search }) => ({
        url: `/${API_ROUTES.ADMIN}/books`,
        params: { page, limit: 5, category, sort, search },
      }),
      providesTags: ["Books"],
      transformResponse: (response: GetBooksResponse) => response.data,
    }),
    fetchBookById: builder.query<BookResponseDto, string>({
      query: (id) => `/${API_ROUTES.ADMIN}/books/book/${id}`,
      providesTags: ["Books"],
      transformResponse: (response: GetBookResponse) => response.data
    }),
    addBook: builder.mutation<AddBookResponse, AddBookArgs>({
      query: (newBook) => ({
        url: `/${API_ROUTES.ADMIN}/books/add-book`,
        method: "POST",
        body: newBook
      }),
      invalidatesTags: ["Books"]
    }),
    updateBook: builder.mutation<UpdateBookResponse, UpdateBookArgs>({
      query: ({id, ...rest}) => ({
        url: `/${API_ROUTES.ADMIN}/books/edit-book/${id}`,
        method: "PUT",
        body: rest,
        headers: {
            'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ["Books"]
    }),
    deleteBook: builder.mutation<DeleteBookResponse, string>({
      query: (id) => ({
        url: `/${API_ROUTES.ADMIN}/books/delete-book/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Books"]
    }),
    getCloudinarySignature: builder.mutation<CloudinarySignatureResponse, CloudinarySignatureArgs>({
      query: (body) => ({
        url: `/${API_ROUTES.ADMIN}/cloudinary-signature`,
        method: "POST",
        body
      }),
    }),
    fetchAllAuthors: builder.query<AuthorListItemDto[], void>({
      query: () => `/${API_ROUTES.ADMIN}/authors`,
      providesTags: ["Authors"],
      transformResponse: (response: GetAllAuthorsResponse) => response.data,
    }),
    fetchFilteredAuthors: builder.query<PaginatedAuthorsDto, GetFilteredAuthorsArgs>({
      query: ({ page, sort, search}) => ({
        url: `/${API_ROUTES.ADMIN}/authors/filtered`,
        params: { page, limit: 5, sort, search },
      }),
      providesTags: ["Authors"],
      transformResponse: (response: GetFilteredAuthorsResponse) => response.data,
    }),
    fetchSingleAuthor: builder.query<AuthorResponseDto, string>({
      query: (id) => `/${API_ROUTES.ADMIN}/authors/${id}`,
      providesTags: (result, error, id) => [{ type: "Authors", id }],
      transformResponse: (response: GetSingleAuthorResponse) => response.data,
    }),
    createAuthor: builder.mutation<CreateAuthorResponse, CreateAuthorArgs>({
      query: (newAuthor) => ({
        url: `/${API_ROUTES.ADMIN}/authors/add-author`,
        method: "POST",
        body: newAuthor,
      }),
      invalidatesTags: ["Authors"],
    }),
    updateAuthor: builder.mutation<UpdateBookResponse, UpdateAuthorArgs>({
      query: ({ id, ...rest }) => ({
        url: `/${API_ROUTES.ADMIN}/authors/edit-author/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Authors"],
    }),
    deleteAuthor: builder.mutation<DeleteAuthorResponse, string>({
      query: (id) => ({
        url: `/${API_ROUTES.ADMIN}/authors/delete-author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Authors"],
    }),
    fetchBanners: builder.query<PaginatedBannersDto, BannersArgs>({
      query: ({page, sort}) => ({
        url: `/${API_ROUTES.ADMIN}/banners`,
        params: { page, limit: 12, sort },
      }),
      providesTags: ["Banners"],
      transformResponse: (response: BannersResponse) => response.data,
    }),
    createBanner: builder.mutation<CreateBannerResponse, CreateBannerArgs>({
      query: (newBanner) => ({
        url: `/${API_ROUTES.ADMIN}/banners/add-banner`,
        method: "POST",
        body: newBanner,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBanner: builder.mutation<UpdateBannerResponse, UpdateBannerArgs>({
      query: ({ id, ...rest }) => ({
        url: `/${API_ROUTES.ADMIN}/banners/edit-banner/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation<DeleteBannerResponse, string>({
      query: (id) => ({
        url: `/${API_ROUTES.ADMIN}/banners/delete-banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBannerStatus: builder.mutation<UpdateBannerStatusResponse, UpdateBannerStatusArgs>({
      query: ({ id, isActive: status }) => ({
        url: `/${API_ROUTES.ADMIN}/banners/update-banner-status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Banners"],
    }),
    fetchUsers: builder.query<PaginatedUsersDto, GetAllUsersArgs>({
      query: ({page, filter, sort, search}) => ({
        url: `/${API_ROUTES.ADMIN}/users`,
        params: { page, limit: 12, filter, sort, search },
      }),
      providesTags: ["Users"],
      transformResponse: (response: GetAllUsersResponse) => response.data,
    }),
    blockUser: builder.mutation<BlockUserResponse, string>({
      query: (uid) => ({
        url: `/${API_ROUTES.ADMIN}/${uid}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    unblockUser: builder.mutation<UnblockUserResponse, string>({
      query: (uid) => ({
        url: `/${API_ROUTES.ADMIN}/${uid}/unblock`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    fetchAuditLogs: builder.query<PaginatedAuditLogsDto, AuditLogsArgs>({
      query: ({page, filter, search}) => ({
        url: `/${API_ROUTES.ADMIN}/audit-logs`,
        params: { page, limit: 12, filter, search },
      }),
      providesTags: ["AuditLogs"],
      transformResponse: (response: AuditLogsResponse) => response.data,
    })
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderStatsQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateDeliveryDetailsMutation,
  useGetRevenueAnalyticsQuery,
  useGetDailyReportQuery,
  useProcessRefundMutation,
  useFetchMonthlyRevenueQuery,
  useFetchYearlyRevenueQuery,
  useExportOrdersCsvMutation,
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchBooksQuery,
  useFetchBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetCloudinarySignatureMutation,
  useFetchAllAuthorsQuery,
  useFetchFilteredAuthorsQuery,
  useFetchSingleAuthorQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  useFetchBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useUpdateBannerStatusMutation,
  useFetchUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useFetchAuditLogsQuery
} = adminApi;
export const { reducer: adminApiReducer, middleware: adminApiMiddleware } =
  adminApi;

export default adminApi;
