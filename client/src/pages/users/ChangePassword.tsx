import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/useAuth";
import { validatePassword } from "../../utils/validatePassword";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FirebaseError } from "firebase/app";

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { changePassword, getProviderId } = useAuth();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const providerId = getProviderId();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    const isValid = validatePassword(newPassword || "");
    setShowConfirm(isValid);
  }, [newPassword]);

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!user?.email) {
      toast.error("User not logged in");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(user.email, data.oldPassword, data.newPassword);
      toast.success("Password changed successfully");
      reset();
      setShowConfirm(false);
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(getErrorMessage(error));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (providerId !== "password") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          Password managed by Google
        </div>
      </div>
    );
  }

  const isNewPasswordValid = validatePassword(newPassword || "");

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            {...register("oldPassword", {
              required: "Old password is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            {...register("newPassword", {
              required: "New password is required",
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.newPassword.message}
            </p>
          )}
          <div className="mt-2 text-xs space-y-1">
            <p
              className={
                (newPassword?.length || 0) >= 8
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {(newPassword?.length || 0) >= 8 ? "✓" : "○"} Min 8 characters
            </p>
            <p
              className={
                /[A-Z]/.test(newPassword || "")
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {/[A-Z]/.test(newPassword || "") ? "✓" : "○"} Uppercase letter
            </p>
            <p
              className={
                /[0-9]/.test(newPassword || "")
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {/[0-9]/.test(newPassword || "") ? "✓" : "○"} Number
            </p>
            <p
              className={
                /[!@#$%^&*(),.?":{}|<>]/.test(newPassword || "")
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword || "") ? "✓" : "○"}{" "}
              Symbol
            </p>
          </div>
        </div>

        {showConfirm && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={
            isSubmitting ||
            !isNewPasswordValid ||
            !showConfirm ||
            Object.keys(errors).length > 0
          }
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
