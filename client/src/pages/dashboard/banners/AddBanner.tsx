import React, { useState } from "react";
import InputField from "../books/common/InputField";
import Textarea from "../books/common/TextArea";
import { useForm } from "react-hook-form";
import { useCreateBannerMutation } from "../../../redux/features/admin/adminApi";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import ImageUploader from "../../../components/ImageUploader";
import { Link, useNavigate } from "react-router-dom";
import { ADMIN } from "../../../constants/nav-routes/adminRoutes";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface AddBannerForm {
  title: string;
  description: string;
  link?: string;
  theme: "primary" | "secondary" | "classic";
}

const AddBanner: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddBannerForm>();
  const [createBanner, { isLoading }] = useCreateBannerMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { uploadImage, progress, uploading } = useCloudinaryUpload({
    folder: "banner-images",
  });

  const navigate = useNavigate();

  const onSubmit = async (formData: AddBannerForm) => {
    try {
      const newBannerData: AddBannerForm & { image?: string } = {
        ...formData,
      };

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        newBannerData.image = uploadRes.secure_url;
      }

      await createBanner(newBannerData).unwrap();
      toast.success("Banner added successfully!");
      reset();
      setImageFile(null);
      navigate(ADMIN.MANAGE_BANNERS);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add banner. Please try again."));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FaUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Add New Banner
                </h2>
                <p className="text-blue-100 text-sm mt-0.5">
                  Create a new banner
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <InputField
                    label="Title"
                    name="title"
                    placeholder="Enter title"
                    register={register}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1.5 ml-0.5">
                      Please add title
                    </p>
                  )}
                </div>

                {/* Link */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Link (Optional)
                    </label>
                    <input
                      {...register("link")}
                      className=" p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="/books?category=categoryId, /books/bookId etc."
                    />
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="primary"
                        {...register("theme", {
                          required: "Theme is required",
                        })}
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-r from-purple-600 to-blue-600"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Primary
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="secondary"
                        {...register("theme", {
                          required: "Theme is required",
                        })}
                        className="w-4 h-4 text-pink-600 focus:ring-2 focus:ring-pink-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-r from-pink-600 to-rose-600"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Secondary
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="classic"
                        {...register("theme", {
                          required: "Theme is required",
                        })}
                        className="w-4 h-4 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Classic
                        </span>
                      </div>
                    </label>
                  </div>
                  {errors.theme && (
                    <p className="text-red-500 text-xs mt-1.5 ml-0.5">
                      {errors.theme.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <ImageUploader label="Banner Image" onSelect={setImageFile} />
                </div>

                {/* Progress bar */}
                {uploading && (
                  <div className="w-full">
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
                      <div
                        className="flex h-full items-center justify-center rounded-full
                   bg-gradient-to-r from-green-400 via-green-500 to-emerald-600
                   text-[10px] font-semibold text-white
                   transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      >
                        {progress > 15 && `${progress}%`}
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-gray-600 text-center font-medium">
                      Uploading image... {progress}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <Textarea
                label="Description"
                name="description"
                placeholder="Add description of the banner here..."
                register={register}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1.5 ml-0.5">
                  Please add description
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to={ADMIN.MANAGE_BANNERS}
                className="flex-1 sm:flex-none order-2 sm:order-1"
              >
                <button
                  type="button"
                  className="w-full px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isLoading || uploading}
                className="flex-1 sm:flex-auto px-8 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-950 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md order-1 sm:order-2"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Uploading...
                  </span>
                ) : isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Adding Banner...
                  </span>
                ) : (
                  "Add Banner"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;
