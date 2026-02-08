import React, { useState } from "react";
import {
  useDeleteBookMutation,
  useFetchBooksQuery,
  useFetchCategoriesQuery,
} from "../../../redux/features/admin/adminApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Pagination from "../../../components/Pagination";
import { ADMIN } from "../../../constants/nav-routes/adminRoutes";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import RatingTooltip from "../../../components/RatingTooltip";

const ManageBooks: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const { data: booksResponse, refetch, isLoading } = useFetchBooksQuery({
    page,
    category,
    sort,
    search,
  });

  const books = booksResponse?.books ?? [];
  const totalBooks = booksResponse?.totalBooks ?? 0;
  const totalPages = booksResponse?.totalPages ?? 1;
  const currentPage = booksResponse?.currentPage ?? 1;

  const { data: categories = [] } = useFetchCategoriesQuery();
  const [deleteBook] = useDeleteBookMutation();

  const handleDeleteBook = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">
            Are you sure you want to delete this book?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm rounded border"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteBook(id).unwrap();
                  toast.success("Book deleted successfully!");
                  refetch();
                } catch (err) {
                  toast.error("Failed to delete book");
                  console.error(err);
                }
              }}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const clearFilters = () => {
    setCategory("");
    setSort("");
    setSearch("");
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Books
          </h1>
          <p className="text-gray-600">
            View, edit, and organize your collection
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search books by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>

            <Link to={ADMIN.ADD_BOOK}>
              <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-950 transition-colors flex items-center justify-center gap-2">
                <FaPlus />
                Add Book
              </button>
            </Link>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {books && books.length > 0 ? (
                      books.map((book, index) => (
                        <tr key={book.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {(page - 1) * 10 + index + 1}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {book.title}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-gray-700 hover:underline">
                            <Link
                              to={`/admin/dashboard/manage-authors/${book.author.id}`}
                            >
                              {book.author.name}
                            </Link>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {book.category.name}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {book.averageRating === 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 italic">
                                Not rated
                              </span>
                            ) : (
                              <div className="relative inline-block group">
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-blue-100 cursor-pointer">
                                  {book.averageRating.toFixed(1)}⭐ (
                                  {book.ratingCount})
                                </span>
                                <div className="hidden group-hover:block">
                                  <RatingTooltip ratingBreakdown={book.ratingBreakdown} />
                                </div>
                              </div>
                            )}
                          </td>

                          <td
                            className={`px-6 py-4 text-sm font-medium ${
                              book.stock === 0
                                ? "text-red-600"
                                : book.stock < 10
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {book.stock === 0
                              ? "Out of Stock"
                              : book.stock < 10
                              ? `Low Stock(${book.stock})`
                              : book.stock}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            ₹
                            {book.sellingPrice.toLocaleString(
                              "en-GB"
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/admin/dashboard/edit-book/${book.id}`}
                              >
                                <button className="p-2 text-gray-950 hover:bg-blue-50 rounded transition-colors">
                                  <FaEdit />
                                </button>
                              </Link>

                              <button
                                onClick={() => handleDeleteBook(book.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <p className="text-gray-500 mb-4">No books found</p>
                          <Link to={ADMIN.ADD_BOOK}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                              <FaPlus />
                              Add your first book
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {books && books.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <p>
                      Showing {books.length} books
                      {totalBooks && (
                        <span> of {totalBooks} total</span>
                      )}
                    </p>
                    {currentPage && totalPages && (
                      <p>
                        Page {currentPage} of {totalPages}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageBooks;