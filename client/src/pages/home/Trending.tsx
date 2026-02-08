import React from 'react';
import { useFetchTrendingBooksQuery } from '../../redux/features/books/bookApi';
import { Link } from 'react-router-dom';

const Trending: React.FC = () => {
  const daysBack = 30;
  const { data: books = [], isLoading } = useFetchTrendingBooksQuery(daysBack);

  if (!isLoading && (!books || books.length === 0)) {
    return null;
  }

  const getGridClasses = (): string => {
    const count = books.length;
    
    // Use explicit classes instead of template literals for Tailwind to recognize them
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    if (count === 4) return 'grid-cols-4';
    if (count === 5) return 'grid-cols-5';
    if (count === 6) return 'grid-cols-3 md:grid-cols-6';
    if (count === 7) return 'grid-cols-4 md:grid-cols-7';
    if (count === 8) return 'grid-cols-4 md:grid-cols-8';
    if (count === 9) return 'grid-cols-5 md:grid-cols-9';
    
    return 'grid-cols-5 lg:grid-cols-10';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <h2 className="text-xl md:text-2xl font-bold text-black mb-4">
        Trending Now
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className={`grid ${getGridClasses()} gap-2 md:gap-3 ${books.length <= 5 ? 'max-w-3xl' : ''}`}>
          {books.map((book) => (
            <div
              key={book.id}
              className="relative group cursor-pointer w-full"
            >
              <Link to={`/books/${book.id}`} className="block">
                <div className="relative overflow-hidden rounded bg-neutral-800 w-full pb-[150%]">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
                  />
                
                  <div className="absolute bottom-1 left-0.5 md:bottom-2 md:left-1 pointer-events-none">
                    <svg viewBox="0 0 120 160" className="w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 lg:w-20 lg:h-28">
                      <text
                        x="5"
                        y="140"
                        fontSize="120"
                        fontWeight="900"
                        fill="transparent"
                        stroke="#fafafa"
                        strokeWidth="6"
                        fontFamily="Impact, Arial Black, sans-serif"
                        letterSpacing="-5"
                      >
                        {book.trend}
                      </text>
                      <text
                        x="5"
                        y="140"
                        fontSize="120"
                        fontWeight="900"
                        fill="#000000"
                        fontFamily="Impact, Arial Black, sans-serif"
                        letterSpacing="-5"
                      >
                        {book.trend}
                      </text>
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;