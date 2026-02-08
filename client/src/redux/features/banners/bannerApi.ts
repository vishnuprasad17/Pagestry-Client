import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../auth/baseQuery";
import { API_ROUTES } from "../../../constants/apiRoutes";
import { BannerData, GetBannersResponse } from "../../../types/banner";

const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: baseQueryWithAuth as BaseQueryFn,
  tagTypes: ["Banners"],

  endpoints: (builder) => ({
    fetchBanners: builder.query<BannerData[], void>({
      query: () => `/${API_ROUTES.BANNERS}/`,
      providesTags: ["Banners"],
      transformResponse: (response: GetBannersResponse) => response.data,
    }),
  }),
});

export const { useFetchBannersQuery } = bannerApi;
export default bannerApi;