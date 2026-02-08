interface BookData {
    id: string;
    title: string;
    authorId: string;
    description: string;
    categoryId: string;
    ISBN: string;
    coverImage: string;
    mrp: number;
    sellingPrice: number;
    stock: number;
    featured: boolean;
    totalRating: number;
    ratingCount: number;
    averageRating: number;
    ratingBreakdown: Record<number, number>;
}

interface AuthorBookResponseDto {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  coverImage: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  averageRating: number;
  ratingCount: number;
  discountPercentage: number;
}

// Get All Books
interface GetAllBooksResponse {
    success: boolean;
    data: BookData[];
    message: string;
}

// Get Books
interface FilteredBook {
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

interface FilteredResponse {
    books: FilteredBook[];
    totalPages: number;
    currentPage: number;
    totalBooks: number;
}

interface GetBooksResponse {
    success: boolean;
    data: FilteredResponse;
    message: string;
}

interface GetBooksArgs {
    page: number;
    category: string;
    sort: string;
    search: string;
}

// Search Books
interface SearchBook {
    id: string;
    title: string;
    category: { id: string; name: string };
    coverImage: string;
}

interface SearchBooksResponse {
    success: boolean;
    data: SearchBook[];
    message: string;
}

// Featured Books
interface FeaturedBook {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    mrp: number;
    sellingPrice: number;
    stock: number;
    averageRating: number;
    ratingCount: number;
    discountPercentage: number;
}

interface FeaturedBooksResponse {
    success: boolean;
    data: FeaturedBook[];
    message: string;
}

// Trending Books
interface TrendingBook {
    id: string;
    title: string;
    cover: string;
    trend: number;
}

interface TrendingBooksResponse {
    success: boolean;
    data: TrendingBook[];
    message: string;
}

// Get Single Book
interface SingleBook {
    id: string;
    title: string;
    author: { id: string; name: string };
    category: { id: string; name: string };
    description: string;
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
    createdAt: Date;
}
interface GetSingleBookResponse {
    success: boolean;
    data: SingleBook;
    message: string;
}

interface GetSingleBookArgs {
    id: string;
}

export type {
    BookData,
    AuthorBookResponseDto,
    GetAllBooksResponse,
    FilteredBook,
    FilteredResponse,
    GetBooksResponse,
    GetBooksArgs,
    SearchBook,
    SearchBooksResponse,
    FeaturedBook,
    FeaturedBooksResponse,
    TrendingBook,
    TrendingBooksResponse,
    SingleBook,
    GetSingleBookResponse,
    GetSingleBookArgs
};