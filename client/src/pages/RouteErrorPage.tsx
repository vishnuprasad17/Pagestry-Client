import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../assets/error.json";
import { USER } from "../constants/nav-routes/userRoutes";

const RouteErrorPage: React.FC = () => {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "Please try again later.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      message = "The page you’re looking for doesn’t exist.";
    } else if (error.status === 500) {
      title = "Server error";
      message = "We’re fixing this. Please try again later.";
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">

      <div className="w-80 mb-6">
        <Lottie animationData={errorAnimation} loop />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h1>

      <p className="text-gray-500 mb-6 text-center max-w-md">
        {message}
      </p>

      <Link
        to={USER.HOME}
        className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default RouteErrorPage;