import React from "react";

const UserSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-48 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
    </div>
  </div>
);

export default UserSkeleton;