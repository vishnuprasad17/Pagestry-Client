import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAuth } from "../context/useAuth";
import { toast } from "react-hot-toast";
import { validatePassword } from "../utils/validatePassword";
import { getErrorMessage } from "../utils/getErrorMessage";
import { RootState } from "../redux/store";
import { USER } from "../constants/nav-routes/userRoutes";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { checkExistingUser, registerUser, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      navigate(USER.HOME);
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const name = watch("name");
  const email = watch("email");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    const isValid = validatePassword(password || "");
    setShowConfirm(isValid);
    
    // Revalidate confirm password when password changes
    if (confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      setError("");

      const existingMethods = await checkExistingUser(data.email);
      if (existingMethods.includes("password")) {
        setError("Email already exists. Please use a different email.");
        setIsSubmitting(false);
        return;
      }
      await registerUser(data.email, data.password, data.name);
      toast.success("User registered successfully!");
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

  const isNewPasswordValid = validatePassword(password || "");

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await signInWithGoogle();
      toast.success("Login successful!");
      navigate(USER.HOME);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create an Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Name
            </label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Name must not exceed 20 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
                setValueAs: (value) => value.trim(),
                validate: (value) => {
                  const trimmed = value.trim();
                  if (trimmed.length === 0) return "Name cannot be empty";
                  if (trimmed.length < 3)
                    return "Name must be at least 3 characters";
                  if (trimmed.length > 20)
                    return "Name must not exceed 20 characters";
                  return true;
                },
              })}
              type="text"
              placeholder="Enter your name"
              className={`shadow-sm border rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : name && !errors.name
                  ? "border-green-500 focus:ring-green-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>✗</span>
                {errors.name.message}
              </p>
            )}
            {name && !errors.name && name.trim().length >= 3 && (
              <p className="text-green-600 text-xs mt-1.5 flex items-center gap-1">
                <span>✓</span>
                Name looks good
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              type="email"
              placeholder="Enter your email"
              className={`shadow-sm border rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : email && !errors.email
                  ? "border-green-500 focus:ring-green-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>✗</span>
                {errors.email.message}
              </p>
            )}
            {email && !errors.email && (
              <p className="text-green-600 text-xs mt-1.5 flex items-center gap-1">
                <span>✓</span>
                Valid email address
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain an uppercase letter",
                  hasNumber: (value) =>
                    /[0-9]/.test(value) || "Password must contain a number",
                  hasSymbol: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    "Password must contain a symbol",
                },
              })}
              type="password"
              placeholder="Create a password"
              className={`shadow-sm border rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : password && !errors.password && isNewPasswordValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
            />
            
            {/* Show first error if password is being typed */}
            {errors.password && password && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>✗</span>
                {errors.password.message}
              </p>
            )}

            {/* Password Strength Indicators */}
            {password && (
              <div className="mt-2 text-xs space-y-1">
                <p
                  className={
                    (password?.length || 0) >= 8
                      ? "text-green-600 font-medium"
                      : "text-red-500"
                  }
                >
                  {(password?.length || 0) >= 8 ? "✓" : "✗"} Min 8 characters
                </p>
                <p
                  className={
                    /[A-Z]/.test(password || "")
                      ? "text-green-600 font-medium"
                      : "text-red-500"
                  }
                >
                  {/[A-Z]/.test(password || "") ? "✓" : "✗"} Uppercase letter
                </p>
                <p
                  className={
                    /[0-9]/.test(password || "")
                      ? "text-green-600 font-medium"
                      : "text-red-500"
                  }
                >
                  {/[0-9]/.test(password || "") ? "✓" : "✗"} Number
                </p>
                <p
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(password || "")
                      ? "text-green-600 font-medium"
                      : "text-red-500"
                  }
                >
                  {/[!@#$%^&*(),.?":{}|<>]/.test(password || "") ? "✓" : "✗"}{" "}
                  Symbol
                </p>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          {showConfirm && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                placeholder="Confirm your password"
                className={`shadow-sm border rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 transition ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : confirmPassword &&
                      !errors.confirmPassword &&
                      confirmPassword === password
                    ? "border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              {errors.confirmPassword && confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>✗</span>
                  {errors.confirmPassword.message}
                </p>
              )}
              {confirmPassword &&
                !errors.confirmPassword &&
                confirmPassword === password && (
                  <p className="text-green-600 text-xs mt-1.5 flex items-center gap-1">
                    <span>✓</span>
                    Passwords match
                  </p>
                )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !isNewPasswordValid ||
              !showConfirm ||
              Object.keys(errors).length > 0
            }
            className={`w-full font-semibold py-2.5 rounded-lg shadow-sm transition duration-200 ${
              isSubmitting ||
              !isNewPasswordValid ||
              !showConfirm ||
              Object.keys(errors).length > 0
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-gray-800 hover:bg-gray-900 text-white"
            }`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg border-2 border-gray-300 shadow-sm transition duration-200"
        >
          <FaGoogle className="text-lg text-red-500" />
          <span>Sign in with Google</span>
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to={USER.LOGIN}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="mt-8 text-center text-gray-400 text-xs">
          ©{new Date().getFullYear()} Pagestry. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;