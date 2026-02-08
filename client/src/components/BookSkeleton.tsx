import React from "react";

const BooksSkeleton: React.FC = () => {
  return (
    <div className="py-10 animate-pulse">

      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-3" />
        <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
      </div>

      {/* FILTER + SORT */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="h-10 w-48 bg-gray-200 rounded" />
      </div>

      {/* BOOK GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="border rounded-xl p-3 space-y-3"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200 rounded-lg" />

            {/* Title */}
            <div className="h-4 bg-gray-200 rounded w-3/4" />

            {/* Author */}
            <div className="h-3 bg-gray-200 rounded w-1/2" />

            {/* Price */}
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default BooksSkeleton;