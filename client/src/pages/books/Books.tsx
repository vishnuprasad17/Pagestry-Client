import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchBooksQuery } from "../../redux/features/books/bookApi";
import { useFetchCategoriesQuery } from "../../redux/features/categories/categoryApi";
import { useGetCartQuery } from "../../redux/features/cart/cartApi";
import BookCard from "./BookCard";
import Pagination from "../../components/Pagination";
import BooksSkeleton from "../../components/BookSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FiFilter } from "react-icons/fi";

type QueryParams = {
  page?: number;
  category?: string;
  sort?: string;
  search?: string;
};

const Books: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const guestCart = useSelector((state: RootState) => state.cart.cartItems);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "";
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError } = useFetchBooksQuery({
    page,
    category,
    sort,
    search,
  });

  const books = data?.books ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.currentPage ?? 1;

  const { data: categories = [] } = useFetchCategoriesQuery();

  const { data: serverCart = [] } = useGetCartQuery(user?.mongoUserId ?? "", {
    skip: !user?.mongoUserId
  });

  const isLoggedIn = Boolean(user?.mongoUserId);

  const cartItems = isLoggedIn ? serverCart : guestCart;

  /* ---------------- HANDLERS ---------------- */
  const updateParams = (updates: QueryParams) => {
    const params = Object.fromEntries(searchParams.entries());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all" || value === 1) {
        delete params[key];
      } else {
        params[key] = String(value);
      }
    });

    setSearchParams(params);
  };

  if (isLoading) return <BooksSkeleton />;
  if (isError) return <p className="text-center text-red-500">Failed to load books</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          {search && (
            <p className="text-gray-600 mt-2">
              Search results for <span className="font-semibold">"{search}"</span>
            </p>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-lg border p-5 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Categories</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => updateParams({ category: "all", page: 1 })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                      category === "all"
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParams({ category: cat.id, page: 1 })}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                        category === cat.id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => updateParams({ sort: "", page: 1 })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                      sort === ""
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => updateParams({ sort: "price_asc", page: 1 })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                      sort === "price_asc"
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => updateParams({ sort: "price_desc", page: 1 })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                      sort === "price_desc"
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => updateParams({ sort: "rating", page: 1 })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                      sort === "rating"
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Top Rated
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div>
            {/* MOBILE FILTER BUTTON */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {books.length} {books.length === 1 ? 'book' : 'books'}
              </p>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-medium"
              >
                <FiFilter />
                Filters
              </button>
            </div>

            {/* MOBILE FILTERS DROPDOWN */}
            {showMobileFilters && (
              <div className="lg:hidden mb-4 bg-white border rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      updateParams({ category: e.target.value, page: 1 });
                      setShowMobileFilters(false);
                    }}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => {
                      updateParams({ sort: e.target.value, page: 1 });
                      setShowMobileFilters(false);
                    }}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            )}

            {/* BOOK GRID */}
            {books.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border">
                <p className="text-gray-500 text-lg">No books found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} cartItems={cartItems} user={user} />
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(p: number) => updateParams({ page: p })}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;