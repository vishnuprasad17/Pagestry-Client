import React from 'react'

const SingleBookSkeleton: React.FC = () => {
  return (
    <div className="px-4 py-10 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* IMAGE SKELETON */}
        <div className="flex justify-center">
          <div className="w-[320px] h-[420px] bg-gray-200 rounded-2xl" />
        </div>

        {/* DETAILS SKELETON */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 rounded" />

          <div className="h-20 bg-gray-200 rounded" />

          <div className="flex gap-3">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>

          <div className="h-12 w-40 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default SingleBookSkeleton;
