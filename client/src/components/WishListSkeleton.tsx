import React from 'react'

const WishListSkeleton: React.FC = () => {
  return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-3 border rounded-xl animate-pulse"
          >
            <div className="w-24 h-32 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
}

export default WishListSkeleton;
