import React, { ErrorInfo, ReactNode } from "react";
import Lottie from "lottie-react";
import errorAnimation from "../assets/error.json";
import { USER } from "../constants/nav-routes/userRoutes";

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
}

class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Runtime error:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
          <div className="w-72 mb-6">
            <Lottie animationData={errorAnimation} loop />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h1>

          <p className="text-gray-500 mb-6 text-center max-w-md">
            Please refresh the page or go back to home.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800"
            >
              Refresh
            </button>

            <a
              href={USER.HOME}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-200"
            >
              Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;