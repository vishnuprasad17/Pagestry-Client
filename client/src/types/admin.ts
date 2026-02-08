import { BannerData, BannerTheme } from "./banner";
import { BookData } from "./books";
import { CategoryData } from "./category";

// Get All Orders
type OrderStatus =
  | "PENDING"
  | "PLACED"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  addressLine2?: string;
  landmark?: string;
}

type PaymentMethod = "RAZORPAY" | "COD";
type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  failureReason?: string;
}

interface DeliveryDetails {
  partner: string;
  trackingId: string;
  estimatedDeliveryDate: Date;
  deliveredAt?: Date;
}
interface OrderResponseDto {
  id: string;
  orderId: string;
  userId: string;
  email: string;
  items: {
    bookId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: string;
    coverImage: string;
  }[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  deliveryDetails: DeliveryDetails | null;
  cancellationInfo?: {
    reason?: string;
    cancelledAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedOrdersDto {
  orders: OrderResponseDto[];
  totalPages: number;
  currentPage: number;
  totalOrders: number;
}

interface GetAllOrdersResponse {
  success: boolean;
  data: PaginatedOrdersDto;
  message: string;
}

interface GetAllOrdersArgs {
  page: number;
  limit: number;
  search: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
}

// Get Order Stats
interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  placedOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  failedOrders: number;
}

interface topCustomer {
  userId: string;
  name: string;
  email: string;
  profileImage?: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: Date;
}

interface AdminStats {
  orderStats: OrderStats;
  topCustomers: topCustomer[];
  totalBooks: number;
}
interface OrderStatsResponse {
  success: boolean;
  data: AdminStats;
  message: string;
}

// Get Order
interface OrderResponse {
  success: boolean;
  data: OrderResponseDto;
  message: string;
}

// Update Order Status
interface UpdateOrderStatusResponse {
  success: boolean;
  data: OrderResponseDto;
  message: string;
}

interface UpdateOrderStatusArgs {
  orderId: string;
  status: OrderStatus;
}

// Update Delivery Details
interface UpdateDeliveryDetailsResponse {
  success: boolean;
  data: OrderResponseDto;
  message: string;
}

interface UpdateDeliveryDetailsArgs {
  orderId: string;
  deliveryDetails: {
    partner: string;
    trackingId: string;
    estimatedDeliveryDate: string;
  };
}

// Get Revenue Analytics
interface RevenueAnalyticsDto {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    razorpayRevenue: number;
    codRevenue: number;
  };
  dailyBreakdown: Array<{
    _id: string;
    totalRevenue: number;
    totalOrders: number;
  }>;
}

interface RevenueAnalyticsResponse {
  success: boolean;
  data: RevenueAnalyticsDto;
  message: string;
}

interface RevenueAnalyticsArgs {
  startDate: string;
  endDate: string;
}

// Daily Report
interface DailyReport {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  placedOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  razorpayOrders: number;
  codOrders: number;
}

interface DailyReportResponse {
  success: boolean;
  data: DailyReport;
  message: string;
}

// Process Refund
interface RefundData {
  success: boolean;
  message: string;
  refundId?: string;
}
interface ProcessRefundResponse {
  success: boolean;
  data: RefundData;
  message: string;
}

interface ProcessRefundArgs {
  orderId: string;
  amount: number;
  reason: string;
}

// Monthly Revenue
interface MonthlyRevenueDto {
  success: boolean;
  year: number;
  data: Array<{
    month: string;
    revenue: number;
    orderCount: number;
  }>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageMonthlyRevenue: number;
  };
}

interface MonthlyRevenueResponse {
  success: boolean;
  data: MonthlyRevenueDto;
  message: string;
}

// Yearly Revenue
interface YearlyRevenueDto {
  success: boolean;
  data: Array<{
    year: number;
    revenue: number;
    orders: number;
  }>;
}

interface YearlyRevenueResponse {
  success: boolean;
  data: YearlyRevenueDto;
  message: string;
}

// Export Orders

interface ExportOrdersArgs {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  startDate: string;
  endDate: string;
}

// Get Categories

interface CategoriesResponse {
  success: boolean;
  data: CategoryData[];
  message: string;
}

// Create Category

interface CreateCategoryResponse {
  success: boolean;
  data: CategoryData;
  message: string;
}

interface CreateCategoryArgs {
  name: string;
  icon: string;
}

// Update Category

interface UpdateCategoryResponse {
  success: boolean;
  data: CategoryData;
  message: string;
}

interface UpdateCategoryArgs {
  id: string;
  data: {
    name: string;
    icon: string;
  };
}

// Delete Category

interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

// Get Books
interface BookResponseDto {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  description: string;
  category: {
    id: string;
    name: string;
  };
  ISBN: string;
  coverImage: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  featured: boolean;
  averageRating: number;
  ratingCount: number;
  ratingBreakdown: Record<number, number>;
  discountPercentage: number;
}

interface PaginatedBooksDto {
  books: BookResponseDto[];
  totalPages: number;
  currentPage: number;
  totalBooks: number;
}

interface GetBooksResponse {
  success: boolean;
  data: PaginatedBooksDto;
  message: string;
}

interface GetBooksArgs {
  page: number;
  category: string;
  sort: string;
  search: string;
}

// Get Book

interface GetBookResponse {
  success: boolean;
  data: BookResponseDto;
  message: string;
}

// Add Book

interface AddBookResponse {
  success: boolean;
  data: BookData;
  message: string;
}

interface AddBookArgs {
  title: string;
  authorId: string;
  description: string;
  categoryId: string;
  ISBN: string;
  featured: boolean;
  coverImage: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
}

// Update Book

interface UpdateBookResponse {
  success: boolean;
  data: BookData;
  message: string;
}

interface UpdateBookData {
  title: string;
  description: string;
  category: string;
  featured: boolean;
  mrp: number;
  sellingPrice: number;
  stock: number;
}

interface UpdateBookArgs {
  id: string;
  data: UpdateBookData;
}

// Delete Book

interface DeleteBookResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

// Get Cloudinary Signature
interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

interface CloudinarySignatureArgs {
  folder: string;
}

// Get All Authors
interface AuthorListItemDto {
  id: string;
  name: string;
  profileImage?: string;
}
interface GetAllAuthorsResponse {
  success: boolean;
  data: AuthorListItemDto[];
  message: string;
}

// Get Filtered Authors
interface AuthorResponseDto {
  id: string;
  name: string;
  bio: string;
  profileImage?: string;
  website?: string;
  isFeatured: boolean;
  createdAt: Date;
}

interface PaginatedAuthorsDto {
  authors: AuthorResponseDto[];
  totalPages: number;
  currentPage: number;
  totalAuthors: number;
}
interface GetFilteredAuthorsResponse {
  success: boolean;
  data: PaginatedAuthorsDto;
  message: string;
}

interface GetFilteredAuthorsArgs {
  page: number;
  sort: string;
  search: string;
}

// Get Single Author

interface GetSingleAuthorResponse {
  success: boolean;
  data: AuthorResponseDto;
  message: string;
}

// Create Author

interface CreateAuthorResponse {
  success: boolean;
  data: AuthorResponseDto;
  message: string;
}

interface CreateAuthorArgs {
  name: string;
  bio: string;
  profileImage?: string;
  website?: string;
  isFeatured: boolean;
}

// Update Author

interface UpdateAuthorResponse {
  success: boolean;
  data: AuthorResponseDto;
  message: string;
}

interface UpdateAuthorArgs {
  id: string;
  name: string;
  bio: string;
  profileImage?: string;
  website?: string;
  isFeatured?: boolean;
}

// Delete Author

interface DeleteAuthorResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

// Get Banners

interface BannerResponseDto {
  id: string;
  title: string;
  description: string;
  image: string;
  theme: BannerTheme;
  link?: string;
  isActive: boolean;
  createdAt: Date;
}

interface PaginatedBannersDto {
  banners: BannerResponseDto[];
  totalPages: number;
  currentPage: number;
  totalBanners: number;
}
interface BannersResponse {
  success: boolean;
  data: PaginatedBannersDto;
  message: string;
}

interface BannersArgs {
  page: number;
  sort: string;
}

// Create Banner

interface CreateBannerResponse {
  success: boolean;
  data: BannerData;
  message: string;
}

interface CreateBannerArgs {
  title: string;
  description: string;
  image?: string;
  theme: BannerTheme;
  link?: string;
}

// Update Banner

interface UpdateBannerResponse {
  success: boolean;
  data: BannerData;
  message: string;
}

interface UpdateBannerArgs {
  id: string;
  title: string;
  description: string;
  image?: string;
  theme: BannerTheme;
  link?: string;
}

// Delete Banner

interface DeleteBannerResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

// Update Banner Status

interface UpdateBannerStatusResponse {
  success: boolean;
  data: BannerData;
  message: string;
}

interface UpdateBannerStatusArgs {
  id: string;
  isActive: boolean;
}

// Get All Users

interface UserListItemDto {
  id: string;
  firebaseUid: string;
  name: string;
  username: string;
  isBlocked: boolean;
  createdAt: Date;
}

interface PaginatedUsersDto {
  users: UserListItemDto[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

interface GetAllUsersResponse {
  success: boolean;
  data: PaginatedUsersDto;
  message: string;
}
interface GetAllUsersArgs {
  page: number;
  filter: string;
  sort: string;
  search: string;
}

// Block User

interface BlockUserResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
  }
  message: string;
}

// Unblock User

interface UnblockUserResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
  }
  message: string;
}

// Get Audit Logs

interface AuditLogUserDto {
  id: string;
  name: string;
  username: string;
  role: "user" | "admin";
  isBlocked: boolean;
}

interface AuditLogResponseDto {
  id: string;
  action: "BLOCK_USER" | "UNBLOCK_USER";
  createdAt: Date;

  user: AuditLogUserDto | null;
  admin: AuditLogUserDto | null;
}

interface PaginatedAuditLogsDto {
  auditLogs: AuditLogResponseDto[];
  totalPages: number;
  currentPage: number;
}

interface AuditLogsResponse {
  success: boolean;
  data: PaginatedAuditLogsDto;
  message: string;
}

interface AuditLogsArgs {
  page: number;
  filter: string;
  search: string;
}

export type {
  PaginatedOrdersDto,
  GetAllOrdersResponse,
  GetAllOrdersArgs,
  AdminStats,
  OrderStatsResponse,
  OrderResponseDto,
  OrderResponse,
  UpdateOrderStatusResponse,
  UpdateOrderStatusArgs,
  UpdateDeliveryDetailsResponse,
  UpdateDeliveryDetailsArgs,
  RevenueAnalyticsDto,
  RevenueAnalyticsResponse,
  RevenueAnalyticsArgs,
  DailyReport,
  DailyReportResponse,
  RefundData,
  ProcessRefundResponse,
  ProcessRefundArgs,
  MonthlyRevenueDto,
  MonthlyRevenueResponse,
  YearlyRevenueDto,
  YearlyRevenueResponse,
  ExportOrdersArgs,
  CategoriesResponse,
  CreateCategoryResponse,
  CreateCategoryArgs,
  UpdateCategoryResponse,
  UpdateCategoryArgs,
  DeleteCategoryResponse,
  PaginatedBooksDto,
  GetBooksResponse,
  GetBooksArgs,
  BookResponseDto,
  GetBookResponse,
  AddBookResponse,
  AddBookArgs,
  UpdateBookResponse,
  UpdateBookArgs,
  DeleteBookResponse,
  CloudinarySignatureResponse,
  CloudinarySignatureArgs,
  AuthorListItemDto,
  GetAllAuthorsResponse,
  PaginatedAuthorsDto,
  GetFilteredAuthorsResponse,
  GetFilteredAuthorsArgs,
  AuthorResponseDto,
  GetSingleAuthorResponse,
  CreateAuthorResponse,
  CreateAuthorArgs,
  UpdateAuthorResponse,
  UpdateAuthorArgs,
  DeleteAuthorResponse,
  BannerResponseDto,
  PaginatedBannersDto,
  BannersResponse,
  BannersArgs,
  CreateBannerResponse,
  CreateBannerArgs,
  UpdateBannerResponse,
  UpdateBannerArgs,
  DeleteBannerResponse,
  UpdateBannerStatusResponse,
  UpdateBannerStatusArgs,
  PaginatedUsersDto,
  GetAllUsersResponse,
  GetAllUsersArgs,
  BlockUserResponse,
  UnblockUserResponse,
  PaginatedAuditLogsDto,
  AuditLogsResponse,
  AuditLogsArgs
};