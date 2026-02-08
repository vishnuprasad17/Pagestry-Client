import React, { useState, useEffect } from "react";
import { useFetchFeaturedAuthorsQuery } from "../../redux/features/authors/authorApi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AuthorCardSkeleton from "../../components/skeleton/AuthorCardSkeleton";
import { Link } from "react-router-dom";
import { AuthorData } from "../../types/author";

const FeaturedAuthors: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { data: authors = [], isLoading, isError } = useFetchFeaturedAuthorsQuery();

  const [itemsPerView, setItemsPerView] = useState<number>(5);

  useEffect(() => {
    const getItemsPerView = () => {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 768) return 2;
      if (window.innerWidth < 1024) return 3;
      if (window.innerWidth < 1280) return 4;
      return 5;
    };

    const handleResize = () => {
      setItemsPerView(getItemsPerView());
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, authors.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full bg-gray-100 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-gray-300 rounded animate-pulse w-64 mx-auto mb-6 sm:mb-8"></div>

          <div className="relative px-8 sm:px-12">
            <div className="overflow-hidden">
              <div className="flex gap-4">
                {[...Array(itemsPerView)].map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <AuthorCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="w-full bg-gray-100 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-red-600 text-center mb-6 sm:mb-8 italic">
            Featured Authors
          </h2>
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-2">
              Unable to load featured authors
            </div>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (authors.length === 0) {
    return (
      <div className="w-full bg-gray-100 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-red-600 text-center mb-6 sm:mb-8 italic">
            Featured Authors
          </h2>
          <div className="text-center py-12 text-gray-600">
            No featured authors available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-serif text-red-600 text-center mb-6 sm:mb-8 italic">
          Featured Authors
        </h2>

        <div className="relative px-8 sm:px-12">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-all ${
              currentIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            aria-label="Previous authors"
          >
            <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {/* Authors Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Link to={`/author/${author.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full">
                      <div
                        className="relative w-full"
                        style={{ paddingBottom: "133.33%" }}
                      >
                        <div className="absolute inset-0">
                          <img
                            src={author.profileImage}
                            alt={author.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src =
                                "https://via.placeholder.com/400x500?text=Author";
                            }}
                          />
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 text-center">
                        <h3 className="text-base sm:text-lg font-medium text-gray-800 truncate">
                          {author.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-all ${
              currentIndex === maxIndex
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            aria-label="Next authors"
          >
            <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAuthors;
