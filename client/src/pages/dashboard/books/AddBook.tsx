import React, { useState } from "react";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import { useForm } from "react-hook-form";
import { useAddBookMutation, useFetchAllAuthorsQuery } from "../../../redux/features/admin/adminApi";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import toast from "react-hot-toast";
import {
  useFetchCategoriesQuery,
} from "../../../redux/features/admin/adminApi";
import ImageUploader from "../../../components/ImageUploader";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface AddBookFormValues {
  title: string;
  authorId: string;
  description: string;
  categoryId: string;
  ISBN: string;
  featured?: boolean;
  mrp: number;
  sellingPrice: number;
  stock: number;
}

const AddBook: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddBookFormValues>();

  const { data: authors = [] } = useFetchAllAuthorsQuery();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [addBook, { isLoading }] = useAddBookMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { uploadImage, progress, uploading } = useCloudinaryUpload({
    folder: "book-covers",
  });

  const onSubmit = async (data: AddBookFormValues) => {
    if (!imageFile) {
      toast.error("Please select a cover image");
      return;
    }

    try {
      const uploadRes = await uploadImage(imageFile);

      const newBookData = {
        ...data,
        coverImage: uploadRes.secure_url,
        featured: data.featured || false,
      };

      await addBook(newBookData).unwrap();
      toast.success("Book added successfully!");
      reset();
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "Failed to add book. Please try again."));
  }
  };

  return (
    <div className="max-w-2xl mx-auto md:p-8 p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6">
          <h2 className="text-3xl font-bold text-white">Add New Book</h2>
          <p className="text-blue-100 mt-1">Enter book details and information</p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
        {/* Title */}
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">Please add title</p>
        )}

        {/* Author */}
        <SelectField
          label="Author"
          name="authorId"
          options={[
            { value: "", label: "Select an author" },
            ...authors.map((author) => ({
              value: author.id,
              label: author.name,
            })),
          ]}
          register={register}
        />
        {errors.authorId && (
          <p className="text-red-500 text-xs mt-1">Please select an author</p>
        )}

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">Please add description</p>
        )}

        {/* Category */}
        <SelectField
          label="Category"
          name="categoryId"
          options={[
            { value: "", label: "Select a category" },
            ...categories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          ]}
          register={register}
        />
        {errors.categoryId && (
          <p className="text-red-500 text-xs mt-1">Please select a category</p>
        )}

        {/* ISBN */}
        <InputField
          label="ISBN"
          name="ISBN"
          placeholder="Enter ISBN"
          register={register}
        />
        {errors.ISBN && (
          <p className="text-red-500 text-xs mt-1">Please add ISBN</p>
        )}

        {/* Featured Checkbox */}
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
        
        {/* Old Price */}
        <InputField
          label="Old Price (MRP)"
          name="mrp"
          type="number"
          placeholder="Old Price"
          register={register}
        />
        {errors.mrp && (
          <p className="text-red-500 text-xs mt-1">Please add old price</p>
        )}

        {/* New Price */}
        <InputField
          label="Selling Price"
          name="sellingPrice"
          type="number"
          placeholder="Selling Price"
          register={register}
        />
        {errors.sellingPrice && (
          <p className="text-red-500 text-xs mt-1">Please add selling price</p>
        )}

        {/* Stock */}
        <InputField
          label="Stock Quantity"
          name="stock"
          type="number"
          placeholder="Available stock"
          register={register}
        />

        {/* Cover Image Upload */}
        < ImageUploader label="Cover Image" onSelect={setImageFile} />

        {/* Progress bar */}
        {uploading && (
          <div className="w-full max-w-md mt-3">
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
              <div
                className="flex h-full items-center justify-center rounded-full
                   bg-gradient-to-r from-green-400 via-green-500 to-emerald-600
                   text-[10px] font-semibold text-white
                   transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && `${progress}%`}
              </div>
            </div>

            <p className="mt-1 text-xs text-gray-500 text-right">
              Uploading… {progress}%
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="w-full p-2 mt-3 bg-black text-white font-bold rounded-md hover:bg-blue-950 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <span>Uploading Image...</span>
          ) : isLoading ? (
            <span>Adding Book...</span>
          ) : (
            <span>Add Book</span>
          )}
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddBook;