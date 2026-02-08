import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { FaStar, FaTrash } from "react-icons/fa";

import StarRating from "../../components/StarRating";
import { ConfirmModal } from "../../components/ConfirmModal";
import countWords from "../../utils/wordCount";

import {
  useGetUserReviewForBookQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../../redux/features/review/reviewApi";
import { OrderStatus } from "../../types/order";
import { RootState } from "../../redux/store";

interface Product {
  bookId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
  coverImage: string;
}
interface Props {
  product: Product;
  orderStatus: OrderStatus
}

interface ReviewFormValues {
  rating: number;
  title: string;
  content: string;
}

const OrderProductCard = ({ product, orderStatus }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: existingReview, refetch } = useGetUserReviewForBookQuery(
    {
      userId: user?.mongoUserId!,
      bookId: product.bookId,
    },
    { skip: !user }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    defaultValues: {
      rating: 0,
      title: "",
      content: "",
    },
  });

  const rating = watch("rating");

  const [addReview, { isLoading: adding }] = useAddReviewMutation();
  const [updateReview, { isLoading: updating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

  // Prefill form when editing existing review
  useEffect(() => {
    if (existingReview && isEditing) {
      reset({
        rating: existingReview.rating,
        title: existingReview.title,
        content: existingReview.content,
      });
    }
  }, [existingReview, isEditing, reset]);

  const onSubmit = async (formData: ReviewFormValues) => {
    try {
      if (existingReview) {
        await updateReview({
          id: existingReview.id,
          ...formData,
        }).unwrap();
      } else {
        await addReview({
          userId: user?.mongoUserId!,
          bookId: product.bookId,
          ...formData,
        }).unwrap();
      }

      setIsEditing(false);
      reset();
      await refetch();
    } catch (err) {
      console.error("Review submit failed", err);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!existingReview) return;

    try {
      await deleteReview(existingReview.id).unwrap();
      setShowDeleteModal(false);
      await refetch();
    } catch (err) {
      console.error("Review delete failed", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Book Image */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <div className="relative group">
            <img
              src={product.coverImage}
              alt={product.title || product.title}
              className="w-24 h-32 sm:w-28 sm:h-40 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Book Details & Review */}
        <div className="flex-1 min-w-0">
          {/* Book Info */}
          <div className="mb-4">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
              {product.title || product.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                {product.category || "Books"}
              </span>
              <span className="text-gray-500">Qty: {product.quantity}</span>
              <span className="font-semibold text-gray-900">
                ₹{(product.unitPrice * product.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Existing Review Display */}
          {existingReview && !isEditing && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <StarRating rating={existingReview.rating} onChange={() => {}} readonly />
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Edit Review
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1"
                    title="Delete Review"
                  >
                    <FaTrash className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">
                {existingReview.title}
              </h5>
              <p className="text-sm text-gray-700 leading-relaxed">
                {existingReview.content}
              </p>
            </div>
          )}

          {/* Review Form */}
          {isEditing && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <StarRating
                    rating={rating}
                    onChange={(value) => setValue("rating", value)}
                  />
                  {errors.rating && (
                    <p className="mt-1 text-xs text-red-600">{errors.rating.message}</p>
                  )}
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
                  </label>
                  <input
                    {...register("title", {
                      required: "Title is required",
                      validate: (value) => {
                        const trimmed = value.trim();
                        if (!trimmed) return "Title cannot be empty";
                        const words = countWords(trimmed);
                        if (words < 3) return "Title must be at least 3 words";
                        if (words > 10) return "Title cannot exceed 10 words";
                        return true;
                      },
                      setValueAs: (value) => value.trim(),
                    })}
                    placeholder="Sum up your experience in a few words"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Content Textarea */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    {...register("content", {
                      required: "Review content is required",
                      validate: (value) => {
                        const trimmed = value.trim();
                        if (!trimmed) return "Review cannot be empty";
                        const words = countWords(trimmed);
                        if (words < 5) return "Review must be at least 5 words";
                        if (words > 50) return "Review cannot exceed 50 words";
                        return true;
                      },
                      setValueAs: (value) => value.trim(),
                    })}
                    placeholder="Share your thoughts about this book"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                  {errors.content && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={adding || updating || rating === 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                  >
                    {adding || updating
                      ? "Submitting..."
                      : existingReview
                      ? "Update Review"
                      : "Submit Review"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Write Review Button */}
          {!existingReview && !isEditing && orderStatus === "DELIVERED" && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
            >
              <FaStar className="w-4 h-4" />
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default OrderProductCard;