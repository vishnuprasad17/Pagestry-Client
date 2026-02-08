import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { useFetchFeaturedBooksQuery } from "../../redux/features/books/bookApi";
import { Link } from "react-router-dom";

const Featured = () => {
  const { data: books = [], isLoading } = useFetchFeaturedBooksQuery();

  if (!isLoading && (!books || books.length === 0)) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 sm:py-8 md:py-6">
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={12}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
            1536: { slidesPerView: 7 },
          }}
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <Link to={`/books/${book.id}`}>
              <div className="bg-white rounded border hover:shadow-lg transition cursor-pointer h-full">
                <div className="aspect-[3/4] p-4 flex items-center justify-center bg-gray-50">
                  <img
                    src={book?.coverImage}
                    alt={book.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-3 border-t">
                  <h3 className="font-medium text-sm mb-1 truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 truncate mb-2">
                    {book.author}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">₹{book.sellingPrice}</span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{book.mrp}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      {book.discountPercentage}% off
                    </span>
                  </div>
                </div>
              </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  );
};

export default Featured;
