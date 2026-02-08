import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../auth/baseQuery";
import { API_ROUTES } from "../../../constants/apiRoutes";
import { CreateReviewArgs, CreateReviewResponse, DeleteReviewResponse, DislikeReviewArgs, DislikeReviewResponse, GetAllReviewsArgs, GetAllReviewsResponse, GetUserReviewForBookArgs, GetUserReviewForBookResponse, LikeReviewArgs, LikeReviewResponse, PaginatedReviewsDto, ReviewData, UpdateReviewArgs, UpdateReviewResponse } from "../../../types/review";
import { CreateAddressArgs } from "../../../types/address";

const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithAuth as BaseQueryFn,
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    fetchAllReviews: builder.query<PaginatedReviewsDto, GetAllReviewsArgs>({
      query: ({ bookId, page = 1 }) =>
        `/${API_ROUTES.REVIEWS}/${bookId}?page=${page}`,
      providesTags: ["Review"],
      transformResponse: (response: GetAllReviewsResponse) => response.data,
    }),
    getUserReviewForBook: builder.query<ReviewData, GetUserReviewForBookArgs>({
      query: ({ userId, bookId }) =>
        `/${API_ROUTES.REVIEWS}/user/${userId}/book/${bookId}`,
      providesTags: (result) =>
        result ? [{ type: "Review", id: result.id }] : ["Review"],
      transformResponse: (response: GetUserReviewForBookResponse) => response.data,
    }),
    addReview: builder.mutation<CreateReviewResponse, CreateReviewArgs>({
      query: (newReview) => ({
        url: `/${API_ROUTES.REVIEWS}/add-review`,
        method: "POST",
        body: newReview,
      }),
      invalidatesTags: ["Review"],
    }),
    likeReview: builder.mutation<LikeReviewResponse, LikeReviewArgs>({
      query: ({ userId, reviewId }) => ({
        url: `/${API_ROUTES.REVIEWS}/like/${userId}/${reviewId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Review"],
    }),
    dislikeReview: builder.mutation<DislikeReviewResponse, DislikeReviewArgs>({
      query: ({ userId, reviewId }) => ({
        url: `/${API_ROUTES.REVIEWS}/dislike/${userId}/${reviewId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Review"],
    }),
    updateReview: builder.mutation<UpdateReviewResponse, UpdateReviewArgs>({
      query: ({ id, ...rest }) => ({
        url: `/${API_ROUTES.REVIEWS}/edit/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Review", id }],
    }),
    deleteReview: builder.mutation<DeleteReviewResponse, string>({
      query: (id) => ({
        url: `${API_ROUTES.REVIEWS}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Review", id: id }],
    }),
  }),
});

export const {
  useFetchAllReviewsQuery,
  useGetUserReviewForBookQuery,
  useAddReviewMutation,
  useLikeReviewMutation,
  useDislikeReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
export default reviewApi;
