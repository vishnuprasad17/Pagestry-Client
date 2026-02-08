import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import avatarImg from "../assets/avatar.png";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/useAuth";
import { useSearchBooksQuery } from "../redux/features/books/bookApi";
import { useGetCartQuery } from "../redux/features/cart/cartApi";
import SearchShimmer from "./SearchShimmer";
import { RootState } from "../redux/store";
import { CartData } from "../types/cart";
import { SearchBook } from "../types/books";
import { USER } from "../constants/nav-routes/userRoutes";

interface HistoryItem {
  title: string;
  isHistory: true;
}

type SearchItem = SearchBook | HistoryItem;

const MAX_HISTORY = 5;

const Navbar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const guestCart = useSelector((state: RootState) => state.cart.cartItems);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: serverCart, isLoading } = useGetCartQuery(user?.mongoUserId!, {
      skip: !user?.mongoUserId,
    });

  const isLoggedIn = Boolean(user?.mongoUserId);
  const cartItems: CartData[] = isLoggedIn ? (serverCart ?? []) : guestCart;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchParams, setSearchParams] = useSearchParams();

  /* ---------------- SEARCH STATE ---------------- */
  const query = searchParams.get("search") || "";
  const [debounced, setDebounced] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const searchRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- DEBOUNCE ---------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  /* ---------------- SEARCH API ---------------- */
  const { data: suggestions = [], isFetching } = useSearchBooksQuery(
    debounced,
    { skip: !debounced }
  );

  /* ---------------- SEARCH HISTORY ---------------- */
  const [history, setHistory] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("searchHistory") || "[]");
  });

  const saveHistory = (value: string) => {
    const updated = [value, ...history.filter((h) => h !== value)].slice(
      0,
      MAX_HISTORY
    );

    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const allItems: SearchItem[] =
    debounced && suggestions.length
      ? suggestions
      : history.map((h) => ({ title: h, isHistory: true }));

  /* ---------------- KEYBOARD NAV ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
    }

    if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const value = activeIndex >= 0 && open ? allItems[activeIndex]?.title : query;
      if (value && value.trim()) handleSelect(value.trim());
    }

    if (e.key === "Escape") setOpen(false);
  };

  /* ---------------- SELECT SEARCH ---------------- */
  const handleSelect = (value: string) => {
    saveHistory(value);
    setOpen(false);
    navigate(`/books?search=${encodeURIComponent(value)}`);
  };

  const handleChange = (value: string) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev.entries());
      if (value) params.search = value;
      else delete params.search;
      return params;
    });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [userOpen, setUserOpen] = useState<boolean>(false);
  const userRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-screen-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link 
            to={USER.HOME} 
            className="text-2xl font-bold bg-black bg-clip-text text-transparent transition-all"
          >
            Pagestry
          </Link>

          {/* SEARCH */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl mx-6">
            <div className="relative">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                value={query}
                onFocus={() => setOpen(true)}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for books, authors, genres..."
                className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3 rounded-2xl 
                         focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white
                         outline-none transition-all duration-200 text-sm"
              />
            </div>

            {open && (isFetching || allItems.length > 0) && (
              <div className="absolute mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {isFetching ? (
                  <SearchShimmer />
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {allItems.slice(0, 7).map((item, i) => (
                      <button
                        key={i}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => handleSelect(item.title)}
                        className={`flex gap-4 px-4 py-3.5 w-full text-left transition-all duration-150 ${
                          i === activeIndex 
                            ? "bg-amber-50 border-l-4 border-amber-500" 
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                      >
                        {!("isHistory" in item) && (
                          <img
                            src={item.coverImage}
                            className="w-12 h-16 rounded-lg object-cover shadow-sm"
                            alt=""
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.title}
                          </p>
                          {"isHistory" in item ? (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recent search
                            </p>
                          ) : (
                            <p className="text-xs text-amber-600 mt-1 font-medium">
                              {item.category.name}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {/* DESKTOP ICONS */}
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to={USER.WISHLIST}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors group relative"
                title="Wishlist"
              >
                <HiOutlineHeart className="size-6 text-gray-700 group-hover:text-red-500 transition-colors" />
              </Link>
              
              <Link 
                to={USER.CART}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors group relative"
                title="Shopping Cart"
              >
                <HiOutlineShoppingCart className="size-6 text-gray-700 group-hover:text-amber-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-md">
                    {(isLoggedIn && isLoading) ? "..." : totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* USER */}
            <div className="relative" ref={userRef}>
              {user ? (
                <button
                  onClick={() => setUserOpen((p) => !p)}
                  className="relative group"
                >
                  <img
                    src={user.profileImage || avatarImg}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 hover:ring-amber-500 cursor-pointer transition-all shadow-md group-hover:shadow-lg"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </button>
              ) : (
                <Link 
                  to={USER.LOGIN}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-700 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <HiOutlineUserCircle className="size-5" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}

              {userOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-100 bg-gradient-to-br from-amber-50 to-orange-50">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to={USER.USER_DASHBOARD}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors text-gray-700 hover:text-amber-600"
                      onClick={() => setUserOpen(false)}
                    >
                      <HiOutlineUser className="size-5" />
                      <span className="font-medium">User Profile</span>
                    </Link>
                    <Link
                      to={USER.ORDERS}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors text-gray-700 hover:text-amber-600"
                      onClick={() => setUserOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="font-medium">Orders</span>
                    </Link>
                    
                    <Link
                      to={USER.WISHLIST}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors text-gray-700 hover:text-amber-600 sm:hidden"
                      onClick={() => setUserOpen(false)}
                    >
                      <HiOutlineHeart className="size-5" />
                      <span className="font-medium">Wishlist</span>
                    </Link>
                    
                    <Link
                      to={USER.CART}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition-colors text-gray-700 hover:text-amber-600 sm:hidden"
                      onClick={() => setUserOpen(false)}
                    >
                      <HiOutlineShoppingCart className="size-5" />
                      <span className="font-medium">Cart</span>
                      {totalItems > 0 && (
                        <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;