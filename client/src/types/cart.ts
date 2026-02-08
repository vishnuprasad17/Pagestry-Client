// Get Cart
interface CartData {
  id: string;
  title: string;
  sellingPrice: number;
  stock: number;
  coverImage: string;
  quantity: number;
}

interface GetCartResponse {
  success: boolean;
  data: CartData[];
  message: string;
}

interface GetCartArgs {
  userId: string;
}

// Merge Cart
interface MergeCartResponse {
  success: boolean;
  message: string;
}

interface MergeCartArgs {
  userId: string;
  items: { bookId: string; quantity: number }[];
}

// Update Cart Quantity
interface UpdateCartResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

interface UpdateCartArgs {
  userId: string;
  bookId: string;
  quantity: number;
}

// Remove Cart Item
interface RemoveCartItemResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

interface RemoveCartItemArgs {
  userId: string;
  bookId: string;
}

// Validate Cart
interface ValidateCartResponse {
  success: boolean;
  data: { success: boolean, outOfStock?: string[] };
  message: string;
}

interface ValidateCartArgs {
  bookId: string;
  quantity: number
}

// Clear Cart
interface ClearCartResponse {
  success: boolean;
  message: string;
}

export type {
  CartData,
  GetCartResponse,
  GetCartArgs,
  MergeCartResponse,
  MergeCartArgs,
  UpdateCartResponse,
  UpdateCartArgs,
  RemoveCartItemResponse,
  RemoveCartItemArgs,
  ValidateCartResponse,
  ValidateCartArgs,
  ClearCartResponse
};
