import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../auth/baseQuery';
import { API_ROUTES } from '../../../constants/apiRoutes';
import { CategoryData, GetCategoriesResponse } from '../../../types/category';

const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: baseQueryWithAuth as BaseQueryFn,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        fetchCategories: builder.query<CategoryData[], void>({
            query: () => `/${API_ROUTES.CATEGORIES}/`,
            providesTags: ['Category'],
            transformResponse: (response: GetCategoriesResponse) => response.data
        }),
    }),
});

export const { useFetchCategoriesQuery } = categoryApi;
export default categoryApi;