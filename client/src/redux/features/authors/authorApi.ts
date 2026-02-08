import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../auth/baseQuery";
import { API_ROUTES } from "../../../constants/apiRoutes";
import { AuthorData, GetAllAuthorsResponse, GetAuthorDetailsResponse, GetFeaturedAuthorsResponse } from "../../../types/author";

const authorApi = createApi({
  reducerPath: "authorApi",
  baseQuery: baseQueryWithAuth as BaseQueryFn,
  tagTypes: ["Authors"],

  endpoints: (builder) => ({
    fetchAuthors: builder.query<AuthorData[], void>({
      query: () => `/${API_ROUTES.AUTHORS}/`,
      providesTags: ["Authors"],
      transformResponse: (response: GetAllAuthorsResponse) => response.data,
    }),
    fetchFeaturedAuthors: builder.query<AuthorData[], void>({
      query: () => `/${API_ROUTES.AUTHORS}/featured`,
      providesTags: ["Authors"],
      transformResponse: (response: GetFeaturedAuthorsResponse) => response.data
    }),
    fetchSingleAuthor: builder.query<GetAuthorDetailsResponse, string>({
      query: (id) => `/${API_ROUTES.AUTHORS}/${id}`,
      providesTags: (result, error, id) => [{ type: "Authors", id: id }]
    }),
  }),
});

export const { useFetchAuthorsQuery, useFetchFeaturedAuthorsQuery, useFetchSingleAuthorQuery } = authorApi;
export default authorApi;