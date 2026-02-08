import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { auth } from "../../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import { clearUser } from "../slices/authSlice";
import { clearAdmin } from "../slices/adminSlice";
import getBaseUrl from "../../../utils/baseUrl";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api`,
  credentials: "include",
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args.url;

    // 🔹 ADMIN logout
    if (url.includes("/admin")) {
      api.dispatch(clearAdmin());

      window.location.href = "/admin/login";
    } else {
      // 🔹 USER logout
      await signOut(auth);
      api.dispatch(clearUser());

      window.location.href = "/login";
    }
  }

  return result;
};
