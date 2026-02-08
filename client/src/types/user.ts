interface WishlistData {
  id: string;
  title: string;
  coverImage: string;
  sellingPrice: number;
  mrp: number;
  stock: number;
}

// Get User Details

interface UserData {
  id: string;
  name: string;
  username: string;
  authProvider: string;
  profileImage?: string;
  role?: string;
  isBlocked?: boolean;
  favoriteBooks?: WishlistData[];
  firebaseUid?: string;
  createdAt?: Date;
}

interface GetUserResponse {
  success: boolean;
  data: UserData;
  message: string;
}

// Update User Details

interface UpdateUserResponse {
  success: boolean;
  data: UserData;
  message: string;
}

interface UpdateData {
    name?: string;
    profileImage: string;
}

interface UpdateUserArgs {
  userId: string;
  data: UpdateData;
}

// Add To WishList / Remove From WishList

interface WishListResponse {
  success: boolean;
  data: { success: boolean };
  message: string;
}

interface WishListArgs {
  userId: string;
  bookId: string;
}

// Get WishList

interface GetWishListResponse {
  success: boolean;
  data: WishlistData[];
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

export type {
  GetUserResponse,
  UserData,
  UpdateData,
  UpdateUserResponse,
  UpdateUserArgs,
  WishlistData,
  WishListResponse,
  WishListArgs,
  GetWishListResponse,
  CloudinarySignatureResponse,
  CloudinarySignatureArgs
};
