import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getApiErrorMessage = (err: unknown, fallback = "Something went wrong") => {
  const error = err as FetchBaseQueryError & {
    data?: { message?: string };
  };
  return error?.data?.message || fallback;
};