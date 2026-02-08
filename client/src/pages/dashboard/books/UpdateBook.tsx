import React, { useEffect, useState } from "react";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchCategoriesQuery,
  useFetchBookByIdQuery,
  useUpdateBookMutation,
} from "../../../redux/features/admin/adminApi";
import Loading from "../../../components/Loading";
import toast from "react-hot-toast";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import ImageUploader from "../../../components/ImageUploader";
import { ADMIN } from "../../../constants/nav-routes/adminRoutes";

interface UpdateBookForm {
  title: string;
  description: string;
  category: string;
  coverImage?: string;
  featured: boolean;
  mrp: number;
  sellingPrice: number;
  stock: number;
}

const UpdateBook: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate(ADMIN.MANAGE_BOOKS);
    return null;
  }
  const {
    data: bookData,
    isLoading,
    isError,
    refetch,
  } = useFetchBookByIdQuery(id);

  const { data: categories = [] } = useFetchCategoriesQuery();
  
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState(bookData?.coverImage || null);
  const { uploadImage, progress, uploading } = useCloudinaryUpload({
    folder: "book-covers",
  });

  const { register, handleSubmit, setValue } = useForm<UpdateBookForm>();

  useEffect(() => {
    if (bookData) {
      setValue("title", bookData.title);
      setValue("description", bookData.description);
      setValue("category", bookData?.category.id);
      setValue("featured", bookData.featured);
      setValue("mrp", bookData.mrp);
      setValue("sellingPrice", bookData.sellingPrice);
      setValue("stock", bookData.stock);
      setCurrentImage(bookData.coverImage)
    }
  }, [bookData, setValue]);

  const handleRemoveImage = () => {
    setCurrentImage(null);
    setImageFile(null);
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentImage(previewUrl);
    }
  };

  const onSubmit = async (formData: UpdateBookForm) => {
    try {
      let updateBookData: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        featured: formData.featured,
        mrp: Number(formData.mrp),
        sellingPrice: Number(formData.sellingPrice),
        stock: Number(formData.stock),
      };

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        updateBookData.coverImage = uploadRes.secure_url;
      }

      await updateBook({ id, ...updateBookData }).unwrap();
      toast.success("Book updated successfully!");
      await refetch();
      navigate(ADMIN.MANAGE_BOOKS);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update book.");
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Error fetching book data</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto md:p-8 p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6">
          <h2 className="text-3xl font-bold text-white">Update Book</h2>
          <p className="text-blue-100 mt-1">Edit book details and information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          <div className="space-y-5">
            <InputField
              label="Title"
              name="title"
              placeholder="Enter book title"
              register={register}
            />

            <InputField
              label="Description"
              name="description"
              placeholder="Enter book description"
              type="textarea"
              register={register}
            />

            <SelectField
              label="Category"
              name="category"
              options={[
                { value: "", label: "Choose A Category" },
                ...categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
              register={register}
            />

            <div className="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100">
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                />
                <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  Featured Book
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Maximum Retail Price"
                name="mrp"
                type="number"
                placeholder="MRP Price"
                register={register}
              />

              <InputField
                label="Selling Price"
                name="sellingPrice"
                type="number"
                placeholder="Selling Price"
                register={register}
              />

              <InputField
                label="Stock"
                name="stock"
                type="number"
                placeholder="Stock"
                register={register}
              />
            </div>

            {/* Cover Image Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Cover Image
              </label>
              
              {currentImage ? (
                <div className="relative group">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 transition-all duration-300">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={currentImage}
                        alt="Book Cover"
                        className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="mt-4 w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="transition-all duration-300">
                  <ImageUploader label="Book Cover" onSelect={handleImageSelect} />
                </div>
              )}
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="space-y-2 animate-fadeIn">
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
                  <div
                    className="flex h-full items-center justify-center rounded-full
                               bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
                               text-[10px] font-semibold text-white
                               transition-all duration-500 ease-out shadow-md"
                    style={{ width: `${progress}%` }}
                  >
                    {progress > 15 && `${progress}%`}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Uploading image...</span>
                  <span className="text-blue-600 font-bold">{progress}%</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdating || uploading}
            className="w-full py-3 px-6 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isUpdating || uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Book
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;