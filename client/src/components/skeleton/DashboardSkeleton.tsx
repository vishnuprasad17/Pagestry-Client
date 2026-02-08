import React from "react";

const ShimmerCard: React.FC = () => (
  <div className="bg-white p-4 rounded-lg shadow animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ShimmerList = () => (
  <div className="p-6 space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center p-3 animate-pulse">
        <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    ))}
  </div>
);

const ShimmerTable = () => (
  <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

export { ShimmerCard, ShimmerList, ShimmerTable };