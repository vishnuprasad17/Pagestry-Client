import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { validatePassword } from "../utils/validatePassword";
import { getErrorMessage } from "../utils/getErrorMessage";
import { RootState } from "../redux/store";
import { FirebaseError } from "firebase/app";
import { USER } from "../constants/nav-routes/userRoutes";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { loginUser, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      navigate(USER.HOME);
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const isNewPasswordValid = validatePassword(data.password);
    if (!isNewPasswordValid) {
      setError("Invalid password! Please try again.");
      setIsSubmitting(false);
      return;
    }
    try {
      setError("");
      await loginUser(data.email, data.password);
      toast.success("Login successful!");
      setIsSubmitting(false);
      navigate(USER.HOME);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await signInWithGoogle();
      toast.success("Login successful!");
      navigate(USER.HOME);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getErrorMessage(error.code);
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-8 border border-gray-200 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Enter your email"
              className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              placeholder="Enter your password"
              autoComplete="off"
              className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* FORGOT PASSWORD LINK */}
          <div className="mb-6 text-right">
            <Link
              to={USER.FORGOT_PASSWORD}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg shadow-sm transition duration-200"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg border-2 border-gray-300 shadow-sm transition duration-200"
        >
          <FaGoogle className="text-lg text-red-500" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-sm mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to={USER.REGISTER}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

        <p className="mt-8 text-center text-gray-400 text-xs">
          ©{new Date().getFullYear()} Pagestry. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
