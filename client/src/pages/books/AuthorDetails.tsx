import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaGlobe, FaBook, FaWikipediaW } from "react-icons/fa";
import { useFetchSingleAuthorQuery } from "../../redux/features/authors/authorApi";
import AuthorDetailSkeleton from "../../components/skeleton/AuthorDetailSkeleton";

const AuthorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useFetchSingleAuthorQuery(id!, {
    skip: !id,
  });

  const author = data?.data?.author || null;
  const books = data?.data?.books || [];

  if (isLoading) return <AuthorDetailSkeleton />;

  if (isError || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Author Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the author you're looking for.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative z-0 h-48 sm:h-72 lg:h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-28 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10 items-center md:items-start">
              {/* Image */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 shrink-0">
                <div className="w-full h-full rounded-2xl overflow-hidden ring-4 ring-gray-100 shadow-md">
                  {author.profileImage ? (
                    <img
                      src={author.profileImage}
                      alt={author.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400?text=" +
                          author.name.charAt(0))
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {author.isFeatured && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {author.name}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                  <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
                    <FaBook /> Author
                  </span>

                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm"
                    >
                      <FaGlobe /> Website
                    </a>
                  )}

                  <a
                      href={`https://en.wikipedia.org/wiki/${author.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm"
                    >
                      <FaWikipediaW /> Wiki
                    </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t pt-8 mb-10">
              <h2 className="text-xl font-bold mb-4">Biography</h2>
              <div className="prose prose-gray max-w-3xl">
                <p className="whitespace-pre-line">{author.bio}</p>
              </div>
            </div>

            {/* Books */}
            {books.length > 0 && (
              <div className="border-t pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    Books by {author.name.split(" ")[0]}
                  </h2>
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    {books.length === 0 ? "No books found" : books.length === 1 ? "1 book" : `${books.length} books`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {books.map((book) => (
                    <Link
                      key={book.id}
                      to={`/books/${book.id}`}
                      className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="aspect-[3/4] bg-gray-50 p-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm truncate">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mb-1">
                          {book.category.name}
                        </p>
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-gray-900">
                            ₹{book.sellingPrice}
                          </span>
                          {book.mrp &&
                            book.mrp !== book.sellingPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{book.mrp}
                              </span>
                            )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetailPage;