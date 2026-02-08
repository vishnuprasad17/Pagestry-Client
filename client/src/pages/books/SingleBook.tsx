import React, { useMemo, useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useFetchBookByIdQuery } from "../../redux/features/books/bookApi";
import {
  useFetchWishListQuery,
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
} from "../../redux/features/user/userApi";
import { useGetCartQuery } from "../../redux/features/cart/cartApi";
import {
  useDislikeReviewMutation,
  useFetchAllReviewsQuery,
  useLikeReviewMutation,
} from "../../redux/features/review/reviewApi";
import ReviewCard from "./ReviewCard";
import SingleBookSkeleton from "../../components/skeleton/SingleBookSkeleton";
import formatCount from "../../utils/formatCount";
import Pagination from "../../components/Pagination";
import { useCartActions } from "../../hooks/useCartActions";
import { RootState } from "../../redux/store";
import dayjs from "dayjs";
import RatingTooltip from "../../components/RatingTooltip";

const SingleBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const guestCart = useSelector((state: RootState) => state.cart.cartItems);
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id!, {
    skip: !id,
  });

  // Image zoom state
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  //-----------------------------WISHLIST-----------------------------
  const { data: wishlist = [] } = useFetchWishListQuery(user?.mongoUserId!, {
    skip: !user?.mongoUserId,
  });

  const [addToWishlist] = useAddToWishListMutation();
  const [removeFromWishlist] = useRemoveFromWishListMutation();

  const [page, setPage] = useState(1);

  //-----------------------------CART---------------------------------
  const { data: serverCart = [] } = useGetCartQuery(user?.mongoUserId!, {
    skip: !user?.mongoUserId
  });

  const isLoggedIn = Boolean(user?.mongoUserId);
  const cartItems = isLoggedIn ? serverCart : guestCart;
  const cartItem = cartItems.find(i => i.id === id);
  const qty = cartItem?.quantity || 0;
  
  const { add, increase, decrease, loading } = useCartActions(user);

  const { data: reviewResponse } = useFetchAllReviewsQuery({ bookId: id!, page });
  const reviews = reviewResponse?.reviews ?? [];
  const currentPage = reviewResponse?.currentPage ?? 1;
  const totalPages = reviewResponse?.totalPages ?? 1;
  
  const [likeReview] = useLikeReviewMutation();
  const [dislikeReview] = useDislikeReviewMutation();

  // check if book already in wishlist
  const isWishlisted = useMemo(() => {
    return wishlist.some((item) => item.id === id);
  }, [wishlist, id]);

  const handleWishlistToggle = () => {
    if (!user?.mongoUserId) return;

    if (isWishlisted) {
      removeFromWishlist({ userId: user.mongoUserId, bookId: id! });
    } else {
      addToWishlist({ userId: user.mongoUserId, bookId: id! });
    }
  };

  // Handle mouse move for zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  if (!book || isLoading) return <SingleBookSkeleton />;
  if (isError) return <div>Error loading book</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* BOOK SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* IMAGE with ZOOM */}
          <div className="relative">
            <div 
              className="relative bg-white p-8 group"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Wishlist Icon */}
              { isLoggedIn && (
              <button
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
              >
                {isWishlisted ? (
                  <FaHeart size={18} className="text-black" />
                ) : (
                  <FaRegHeart size={18} className="text-neutral-400" />
                )}
              </button>
              )}

              {/* Main Image */}
              <img
                ref={imageRef}
                src={book.coverImage}
                alt={book.title}
                className="w-full h-[500px] object-contain cursor-crosshair"
                loading="lazy"
              />

              {/* Zoom Indicator */}
              {showZoom && (
                <div className="absolute bottom-4 left-4 text-xs text-neutral-400 flex items-center gap-1">
                  <span>🔍</span>
                  <span>Hover to zoom</span>
                </div>
              )}
            </div>

            {/* Zoomed Image Overlay */}
            {showZoom && (
              <div className="hidden lg:block absolute top-0 left-full ml-8 w-[500px] h-[500px] bg-white shadow-2xl border border-neutral-100 overflow-hidden pointer-events-none z-20">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${book.coverImage})`,
                    backgroundSize: '200%',
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            {/* Category */}
            <div className="text-xs uppercase tracking-wider text-neutral-400 mb-3">
              {book.category.name}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-light text-neutral-900 mb-4 leading-tight">
              {book.title}
            </h1>

            {/* Author */}
            <p className="text-lg text-neutral-600 mb-6">
              {book.author.name || "Admin"}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-neutral-200">
              <div className="relative group inline-flex items-center gap-2 cursor-pointer">
                <FaStar className="text-neutral-900" size={16} />
                <span className="text-lg font-medium text-neutral-900">
                  {book.averageRating?.toFixed(1) || "0.0"}
                </span>
                {book.averageRating > 0 && (
                  <div className="hidden group-hover:block">
                    <RatingTooltip ratingBreakdown={book.ratingBreakdown} />
                  </div>
                )}
              </div>
              <span className="text-sm text-neutral-400">
                {formatCount(book.ratingCount)} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-light text-neutral-900">
                  ₹{book.sellingPrice.toLocaleString("en-IN")}
                </span>
                {book.discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-neutral-400 line-through">
                      ₹{book.mrp.toLocaleString("en-IN")}
                    </span>
                    <span className="text-md font-medium text-green-600">
                      Save {book.discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              {book.stock > 0 && book.stock < 10 && (
                <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  Only {book.stock} left in stock!
                </div>
              )}
            </div>

            {/* Cart Actions */}
            <div className="mb-12">
              {book.stock === 0 ? (
                <button className="w-full py-4 bg-neutral-200 text-neutral-500 text-sm uppercase tracking-wider cursor-not-allowed">
                  Out of Stock
                </button>
              ) : qty === 0 ? (
                <button
                  onClick={() => add(book)}
                  className="w-full py-4 bg-neutral-900 text-white text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-neutral-300">
                    <button
                      onClick={() => decrease(book, qty)}
                      disabled={loading}
                      className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    >
                      {qty === 1 ? (
                        <FaTrash size={12} className="text-neutral-400" />
                      ) : (
                        <span className="text-lg text-neutral-600">−</span>
                      )}
                    </button>

                    <span className="w-16 text-center font-light text-lg">{qty}</span>

                    <button
                      onClick={() => increase(book, qty)}
                      disabled={qty >= book.stock || loading}
                      className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-30"
                    >
                      <span className="text-lg text-neutral-600">+</span>
                    </button>
                  </div>
                  <span className="text-sm text-neutral-500">In Cart</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-3">
                Description
              </h3>
              <p className="text-neutral-600 leading-relaxed font-light">
                {book.description}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-400">Published</span>
                <span className="text-neutral-700">
                  {dayjs(book.createdAt).format("MMMM, D, YYYY")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-24 pt-12 border-t border-neutral-200">
          <h2 className="text-2xl font-light text-neutral-900 mb-12">
            Customer Reviews
          </h2>

          {reviews?.length ? (
            <>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-neutral-100 last:border-0">
                    <ReviewCard
                      isLoggedin={Boolean(user?.mongoUserId)}
                      review={review}
                      onLike={() =>
                        likeReview({
                          userId: user?.mongoUserId!,
                          reviewId: review.id,
                        })
                      }
                      onDislike={() =>
                        dislikeReview({
                          userId: user?.mongoUserId!,
                          reviewId: review.id,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-400 font-light">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;