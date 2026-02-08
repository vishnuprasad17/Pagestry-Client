import React from "react";

const OrderDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-9 bg-gray-300 rounded-lg w-64"></div>
            <div className="h-9 bg-gray-300 rounded-full w-40"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-48"></div>
          </div>
        </div>

        {/* Order Status Bar Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
              <div className="h-full bg-gray-300 w-1/2"></div>
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="mt-3 h-4 bg-gray-300 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Cards Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gray-300 rounded-lg"></div>
              <div className="h-6 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-gray-300 rounded mt-0.5"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-40"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gray-300 rounded-lg"></div>
              <div className="h-6 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Delivery Partner Skeleton */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-gray-300 rounded-lg"></div>
            <div className="h-6 bg-gray-300 rounded w-40"></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item}>
                <div className="h-3 bg-gray-300 rounded w-20 mb-2"></div>
                <div className="h-5 bg-gray-300 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section Skeleton */}
        <div className="mb-6">
          <div className="h-7 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
          
          {/* Product Cards Skeleton */}
          {[1, 2].map((card) => (
            <div
              key={card}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 animate-pulse"
            >
              <div className="flex gap-6">
                {/* Book Image Skeleton */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-40 bg-gray-300 rounded-lg"></div>
                </div>

                {/* Book Details Skeleton */}
                <div className="flex-1 min-w-0">
                  {/* Book Info */}
                  <div className="mb-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="flex items-center gap-3">
                      <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>

                  {/* Review Button Skeleton */}
                  <div className="h-10 bg-gray-300 rounded-lg w-40"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-9 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;