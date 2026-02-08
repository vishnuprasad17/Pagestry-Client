import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../context/useAuth"; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessage";
import { FirebaseError } from "firebase/app";
import { USER } from "../constants/nav-routes/userRoutes";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async ({ email }) => {
    try {
      await forgotPassword(email);
      toast.success("If an account exists with this email, a password reset link has been sent.");
      navigate(USER.LOGIN);
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        toast.error(getErrorMessage(error.code));
      } else {
        toast.error("Unable to send reset email. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to login */}
        <p className="text-sm text-center mt-4">
          Remember your password?{" "}
          <span
            className="text-black font-medium cursor-pointer"
            onClick={() => navigate(USER.LOGIN)}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;