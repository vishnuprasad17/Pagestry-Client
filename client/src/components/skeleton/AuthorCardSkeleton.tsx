import React from "react";

const AuthorCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md h-full">
    <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
      <div className="absolute inset-0 bg-gray-200 animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      </div>
    </div>
    <div className="p-3 sm:p-4 text-center">
      <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
    </div>
  </div>
);

export default AuthorCardSkeleton;