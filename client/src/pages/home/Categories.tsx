import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useFetchCategoriesQuery } from '../../redux/features/categories/categoryApi';
import { USER } from '../../constants/nav-routes/userRoutes';

const BrowseByCategory: React.FC = () => {
  const { data: categories = [] } = useFetchCategoriesQuery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:py-8 md:py-12 lg:py-16">
      {/* Header Section */}
      <h2 className="text-xl font-semibold mb-4">
        Categories
      </h2>

      {/* Swiper Container */}
      <div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={categories.length > 5}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
          className="category-swiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link to={`/books?category=${category.id}`}>
                <div className="group relative bg-gradient-to-br from-gray-700 to-gray-950 rounded-lg md:rounded-xl lg:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden aspect-square">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3">
                      {/* Icon */}
                      <div className="transform group-hover:scale-110 transition-transform duration-300 text-white">
                        <div className="text-5xl flex items-center justify-center">
                          {category.icon}
                        </div>
                      </div>
                      
                      {/* Category Name */}
                      <h3 className="text-white font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-center leading-tight px-1">
                        {category.name}
                      </h3>
                    </div>

                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 bg-white opacity-5 rounded-full transform group-hover:scale-125 transition-transform duration-500"></div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Footer Section */}
      <div className="mt-6 md:mt-10 lg:mt-12 text-center">
        <p className="text-slate-600 text-xs sm:text-sm md:text-base px-4">
          Can't find what you're looking for? 
          <Link 
            to={USER.BOOKS} 
            className="ml-1 md:ml-2 text-gray-700 font-semibold hover:text-gray-950 transition-colors underline"
          >
            Search all books
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BrowseByCategory;