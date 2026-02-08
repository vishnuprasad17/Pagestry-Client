import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../auth/baseQuery';
import { API_ROUTES } from '../../../constants/apiRoutes';
import { FeaturedBook, FeaturedBooksResponse, FilteredResponse, GetAllBooksResponse, GetBooksArgs, GetBooksResponse, GetSingleBookResponse, SearchBook, SearchBooksResponse, SingleBook, TrendingBook, TrendingBooksResponse } from '../../../types/books';


const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Books'],
    endpoints: (builder) =>({
        fetchAllBooks: builder.query<GetAllBooksResponse, void>({
            query: () => `/${API_ROUTES.BOOKS}/`,
            providesTags: ["Books"],
            transformResponse: (response: { data: GetAllBooksResponse }) => response.data
        }),
        fetchBooks: builder.query<FilteredResponse, GetBooksArgs>({
            query: ({ page, category, sort, search }) => ({
              url: `/${API_ROUTES.BOOKS}/get-books`,
              params: { page, limit: 12, category, sort, search },
            }),
            providesTags: ["Books"],
            transformResponse: (response: GetBooksResponse) => response.data
        }),
        searchBooks: builder.query<SearchBook[], string>({
            query: (search) => ({
              url: `/${API_ROUTES.BOOKS}/search`,
              params: { search },
            }),
            providesTags: ["Books"],
            transformResponse: (response: SearchBooksResponse) => response.data
        }),
        fetchFeaturedBooks: builder.query<FeaturedBook[], void>({
            query: () => `/${API_ROUTES.BOOKS}/featured`,
            providesTags: ["Books"],
            transformResponse: (response: FeaturedBooksResponse) => response.data
        }),
        fetchTrendingBooks: builder.query<TrendingBook[], number>({
            query: (daysBack) => ({
              url: `/${API_ROUTES.BOOKS}/trending`,
              params: { daysBack },
            }),
            providesTags: ["Books"],
            transformResponse: (response: TrendingBooksResponse) => response.data
        }),
        fetchBookById: builder.query<SingleBook, string>({
            query: (id) => `/${API_ROUTES.BOOKS}/${id}`,
            providesTags: (result, error, id) => [{ type: "Books", id: id }],
            transformResponse: (response: GetSingleBookResponse) => response.data
        })
    })
})

export const {useFetchAllBooksQuery, useFetchBooksQuery, useSearchBooksQuery, useFetchFeaturedBooksQuery, useFetchTrendingBooksQuery, useFetchBookByIdQuery} = bookApi;
export default bookApi;