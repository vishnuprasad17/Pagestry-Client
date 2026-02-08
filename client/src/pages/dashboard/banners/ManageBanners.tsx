import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import {
  useDeleteBannerMutation,
  useFetchBannersQuery,
  useUpdateBannerMutation,
  useUpdateBannerStatusMutation,
} from "../../../redux/features/admin/adminApi";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import ImageUploader from "../../../components/ImageUploader";
import Pagination from "../../../components/Pagination";
import { BannerResponseDto } from "../../../types/admin";

interface BannerForm {
  title: string;
  description: string;
  link?: string;
  theme: "primary" | "secondary" | "classic";
}

const ManageBanners: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("");
  const [editingBanner, setEditingBanner] = useState<BannerResponseDto | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BannerForm>();

  const selectedTheme = watch("theme");

  const { data: bannersResponse } = useFetchBannersQuery({
    page,
    sort,
  });

  const banners = bannersResponse?.banners || [];
  const totalPages = bannersResponse?.totalPages || 1;
  const currentPage = bannersResponse?.currentPage || 1;

  const [updateBanner] = useUpdateBannerMutation();
  const [updateBannerStatus] = useUpdateBannerStatusMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const { uploadImage, progress, uploading } = useCloudinaryUpload({
    folder: "banner-images",
  });

  const themes = ["primary", "secondary", "classic"] as const;

  const themeColors: Record<BannerForm["theme"], string> = {
    primary: "from-purple-600 to-blue-600",
    secondary: "from-pink-600 to-rose-600",
    classic: "from-emerald-600 to-teal-600",
  };

  const handleEdit = (banner: BannerResponseDto) => {
    setEditingBanner(banner);
    const existingImage = banner.image || null;
    setCurrentImage(existingImage);
    setValue("title", banner.title);
    setValue("description", banner.description);
    setValue("link", banner.link);
    setValue("theme", banner.theme);
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentImage(previewUrl);
    }
  };

  const handleCancelEdit = () => {
    setEditingBanner(null);
    setCurrentImage(null);
    reset();
  };

  const handleRemoveImage = () => {
    setCurrentImage(null);
  };

  const handleToggleStatus = async (bannerId: string, currentStatus: boolean) => {
    try {
      await updateBannerStatus({
        id: bannerId,
        isActive: !currentStatus,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update banner status:", error);
    }
  };

  const handleDelete = async (bannerId: string) => {
    try {
      await deleteBanner(bannerId).unwrap();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  const onSubmit = async (formData: BannerForm) => {
    if (!editingBanner) {
      return;
    }

    try {
      const updateData: BannerForm & { image?: string } = {
        ...formData,
      };

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        updateData.image = uploadRes.secure_url;
      }

      await updateBanner({ id: editingBanner?.id, ...updateData }).unwrap();
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to update banner:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Banners</h1>
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Banners</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Edit Banner
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link
                  </label>
                  <input
                    type="text"
                    {...register("link")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="space-y-3">
                    {themes.map((theme) => (
                      <label
                        key={theme}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedTheme === theme
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value={theme}
                          {...register("theme", { required: "Theme is required" })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div
                          className={`w-16 h-8 rounded-md bg-gradient-to-r ${themeColors[theme]}`}
                        />
                        <span className="font-medium text-gray-700 capitalize">
                          {theme}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.theme && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.theme.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  {currentImage ? (
                    <div className="relative">
                      <img
                        src={currentImage}
                        alt={editingBanner.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <ImageUploader label="Upload Image" onSelect={handleImageSelect} />
                  )}
                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      onClick={handleSubmit(onSubmit)}
                      className="px-6 py-2 bg-gray-950 text-white rounded-lg hover:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Update Banner"}
                    </button>
                  </div>

                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="grid gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {banner.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{banner.description}</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {banner.theme.charAt(0).toUpperCase() +
                        banner.theme.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      handleToggleStatus(banner.id, banner.isActive)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition hover:bg-gray-100"
                  >
                    <div
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        banner.isActive ? "bg-black" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          banner.isActive ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      ></div>
                    </div>
                    <span
                      className={
                        banner.isActive ? "text-black" : "text-gray-500"
                      }
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(banner.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No banners found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Banner</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this banner? This action is permanent.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBanners;