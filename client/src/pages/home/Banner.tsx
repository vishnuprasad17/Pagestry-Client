import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useFetchBannersQuery } from '../../redux/features/banners/bannerApi';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { USER } from '../../constants/nav-routes/userRoutes';

const Banner: React.FC = () => {
  const { data: slides = [] } = useFetchBannersQuery();

  const themeColors = {
    primary: "from-purple-600 to-blue-600",
    secondary: "from-pink-600 to-rose-600",
    classic: "from-emerald-600 to-teal-600",
  };

  return (
    <div className="relative w-full bg-white">
      {/* Banner Container */}
      <div className="relative mx-auto" style={{ maxWidth: '1440px' }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{
            el: '.swiper-pagination-custom',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} custom-bullet"></span>`;
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          speed={600}
          className="banner-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-112 xl:h-128 overflow-hidden">
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title || `Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${themeColors[slide.theme] || themeColors.primary} opacity-20`}></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-20">
                    <div className="max-w-xl pl-0 sm:pl-4 md:pl-8 lg:pl-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                          {slide.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-white/95 mb-4 md:mb-6 drop-shadow-md">
                          {slide.description}
                        </p>
                      <Link
                        to={USER.BOOKS}
                      >
                        <button className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-50 transition-colors shadow-lg text-sm md:text-base">
                          Explore Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons - Flipkart Style (Tall & Narrow) */}
        <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-md flex items-center justify-center transition-all duration-200 hover:shadow-lg group"
          style={{
            width: '35px',
            height: '80px',
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px'
          }}>
          <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-blue-600" strokeWidth={2.5} />
        </button>
        
        <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-md flex items-center justify-center transition-all duration-200 hover:shadow-lg group"
          style={{
            width: '35px',
            height: '80px',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px'
          }}>
          <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-blue-600" strokeWidth={2.5} />
        </button>

        {/* Custom Pagination Dots - Flipkart Style */}
        <div className="swiper-pagination-custom absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2"></div>
      </div>
    </div>
  );
};

export default Banner;