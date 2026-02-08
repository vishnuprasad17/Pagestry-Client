interface ReviewData {
    id: string;
    userId: string;
    bookId: string;
    title: string;
    content: string;
    rating: number;
    likedBy: string[];
    dislikedBy: string[];
    createdAt: Date;
}

// Get All Reviews
interface PaginatedReviewData {
  id: string;
  userId: string;
  userName?: string;
  bookId: string;
  title: string;
  content: string;
  rating: number;
  likes: number;
  dislikes: number;
  hasUserLiked?: boolean;
  hasUserDisliked?: boolean;
  createdAt: Date;
}

interface PaginatedReviewsDto {
  reviews: PaginatedReviewData[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface GetAllReviewsResponse {
  success: boolean;
  data: PaginatedReviewsDto;
  message: string;
}

interface GetAllReviewsArgs {
  bookId: string;
  page: number;
}

// Get User Review For Book
interface GetUserReviewForBookResponse {
  success: boolean;
  data: ReviewData;
  message: string;
}

interface GetUserReviewForBookArgs {
  userId: string;
  bookId: string;
}

// Create Review
interface CreateReviewResponse {
  success: boolean;
  data: ReviewData;
  message: string;
}

interface  ReviewFormValues {
  rating: number;
  title: string;
  content: string;
}
interface CreateReviewArgs extends ReviewFormValues {
  userId: string;
  bookId: string;
}

// Like Review
interface LikeReviewResponse {
  success: boolean;
  data: ReviewData;
  message: string;
}

interface LikeReviewArgs {
  userId: string;
  reviewId: string;
}

// Dislike Review
interface DislikeReviewResponse {
  success: boolean;
  data: ReviewData;
  message: string;
}

interface DislikeReviewArgs {
  userId: string;
  reviewId: string;
}

// Update Review
interface UpdateReviewResponse {
  success: boolean;
  data: ReviewData;
  message: string;
}

interface UpdateReviewArgs extends ReviewFormValues {
  id: string;
}

// Delete Review
interface DeleteReviewResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

interface DeleteReviewArgs {
    id: string;
}

export type {
  ReviewData,
  PaginatedReviewData,
  PaginatedReviewsDto,
  GetAllReviewsResponse,
  GetAllReviewsArgs,
  GetUserReviewForBookResponse,
  GetUserReviewForBookArgs,
  CreateReviewResponse,
  CreateReviewArgs,
  LikeReviewResponse,
  LikeReviewArgs,
  DislikeReviewResponse,
  DislikeReviewArgs,
  UpdateReviewResponse,
  UpdateReviewArgs,
  DeleteReviewResponse,
  DeleteReviewArgs
};
