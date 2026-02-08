import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { USER } from "../constants/nav-routes/userRoutes";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#131921] text-gray-300">

      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10">

        {/* LOGO */}
        <div className="col-span-2 sm:col-span-1">
          <Link to={USER.HOME} className="inline-block mb-4">
            <svg
              viewBox="0 0 560 130"
              className="w-40 h-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="0"
                y="95"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="56"
                fontWeight="600"
                letterSpacing="-0.03em"
                fill="currentColor"
              >
                Pagestry
              </text>
            </svg>
          </Link>

          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted online bookstore. Discover, read, and grow with
            thousands of books across all categories.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {["About Us", "Careers", "Blog"].map(item => (
              <li key={item}>
                <Link
                  to={USER.HOME}
                  className="hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h4 className="text-white font-semibold mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            {["Contact Us", "Shipping", "Returns", "FAQ"].map(item => (
              <li key={item}>
                <Link
                  to={USER.HOME}
                  className="hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <h4 className="text-white font-semibold mb-4">Policies</h4>
          <ul className="space-y-2 text-sm">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map(item => (
              <li key={item}>
                <Link
                  to={USER.HOME}
                  className="hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm text-gray-400 mb-3">
            Get offers & updates straight to your inbox.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-3 py-2 text-sm rounded-l bg-gray-100 text-black outline-none focus:ring-2 focus:ring-[#febd69]"
            />
            <button
              className="bg-[#febd69] px-4 py-2 text-sm font-semibold text-black rounded-r hover:bg-[#f3a847] transition"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-700" />

      {/* BOTTOM */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Pagestry Publications. All rights reserved.
        </p>

        <div className="flex gap-5">
          {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="hover:text-white transition transform hover:scale-110"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;