import React, { useState, useEffect } from 'react';

const RatingTooltip = ({ ratingBreakdown }: { ratingBreakdown: { [key: number]: number } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const totalRatings = Object.values(ratingBreakdown).reduce((sum, count) => sum + count, 0);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 animate-fadeIn">
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="mb-3 pb-2 border-b border-gray-100">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
              Rating Breakdown
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          
          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingBreakdown[star] || 0;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-2.5 group">
                  <span className="w-9 text-xs font-medium text-gray-700 flex items-center gap-0.5">
                    {star}
                    <span className="text-black text-sm">★</span>
                  </span>
                  
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-gray-800 to-gray-900 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        transformOrigin: 'left'
                      }}
                    ></div>
                  </div>
                  
                  <span className="w-10 text-right text-xs font-medium text-gray-600">
                    {count}
                  </span>
                  
                  <span className="w-10 text-right text-xs text-gray-400">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {/* Arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
        <div className="border-8 border-transparent border-t-white" style={{ filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.05))' }}></div>
      </div>
    </div>
  );
};

export default RatingTooltip;