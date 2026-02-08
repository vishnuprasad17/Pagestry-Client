import React, { useState } from "react";
import InputField from "../books/common/InputField";
import Textarea from "../books/common/TextArea";
import { useForm } from "react-hook-form";
import { useCreateAuthorMutation } from "../../../redux/features/admin/adminApi";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import ImageUploader from "../../../components/ImageUploader";
import { Link, useNavigate } from "react-router-dom";
import { ADMIN } from "../../../constants/nav-routes/adminRoutes";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface AddAuthorForm {
  name: string;
  bio: string;
  featured?: boolean;
  website?: string;
}

const AddAuthor: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddAuthorForm>();
  const [createAuthor, { isLoading }] = useCreateAuthorMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { uploadImage, progress, uploading } = useCloudinaryUpload({
    folder: "author-profiles",
  });

  const navigate = useNavigate();

  const onSubmit = async (formData: AddAuthorForm) => {
    try {
      const newAuthorData: AddAuthorForm & { isFeatured: boolean; profileImage?: string } = {
        ...formData,
        isFeatured: formData.featured || false,
      };

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        newAuthorData.profileImage = uploadRes.secure_url;
      }

      await createAuthor(newAuthorData).unwrap();
      toast.success("Author added successfully!");
      reset();
      setImageFile(null);
      navigate(ADMIN.MANAGE_AUTHORS);
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "Failed to add author. Please try again."));
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
                  Add New Author
                </h2>
                <p className="text-blue-100 text-sm mt-0.5">
                  Create a new author profile
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <InputField
                    label="Full Name"
                    name="name"
                    placeholder="e.g., John Doe"
                    register={register}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 ml-0.5">
                      Please add name
                    </p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      {...register("website")}
                      className=" p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        {...register("featured")}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Mark as Featured Author
                    </span>
                  </label>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Profile Image
                  </label>

                  <ImageUploader label="" onSelect={setImageFile} />
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

            {/* Bio - Full Width */}
            <div className="mt-6">
              <Textarea
                label="Biography"
                name="bio"
                placeholder="Write a brief biography about the author..."
                register={register}
              />
              {errors.bio && (
                <p className="text-red-500 text-xs mt-1.5 ml-0.5">
                  Please add bio
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to={ADMIN.MANAGE_AUTHORS}>
                <button
                  type="button"
                  className="flex-1 sm:flex-none px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
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
                    Adding Author...
                  </span>
                ) : (
                  "Add Author"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuthor;
