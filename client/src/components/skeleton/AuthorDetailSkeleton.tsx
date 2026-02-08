import React from "react";

const AuthorDetailSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    
    <div className="relative h-72 bg-gradient-to-r from-red-600 to-red-800 animate-pulse"></div>
    
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full bg-gray-200 animate-shimmer mx-auto md:mx-0"></div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-shimmer w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/4"></div>
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
                <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AuthorDetailSkeleton;