import React, { useState } from 'react';
import avatarImage from '../../assets/admin-avatar.png';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminLogoutMutation } from '../../redux/features/auth/authApi';
import { HiViewGridAdd } from "react-icons/hi";
import { MdMenu, MdOutlineCategory, MdOutlineManageHistory, MdClose, MdOutlineListAlt } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { clearAdmin } from '../../redux/features/slices/adminSlice';
import { FaSearch, FaBookOpen, FaUserEdit, FaChevronDown, FaChevronRight, FaImages, FaUsers, FaUsersCog } from 'react-icons/fa';
import { AiOutlineAudit } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import ScrollToTop from '../../components/ScrollToTop';
import { ADMIN } from '../../constants/nav-routes/adminRoutes';
import { AppDispatch, RootState } from '../../redux/store';

const DashboardLayout: React.FC = () => {
  const admin = useSelector((state: RootState) => state.admin.admin);
  const [adminLogout] = useAdminLogoutMutation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [bannersOpen, setBannersOpen] = useState<boolean>(true);
  const [booksOpen, setBooksOpen] = useState<boolean>(true);
  const [authorsOpen, setAuthorsOpen] = useState<boolean>(true);
  const [usersOpen, setUsersOpen] = useState<boolean>(true);
  const location = useLocation();
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const handleLogout = async() => {
    await adminLogout();
    dispatch(clearAdmin());
    navigate(ADMIN.LOGIN);
  }

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  }

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  }

  const isBannerRoute = (): boolean => {
    return location.pathname === ADMIN.ADD_BANNER || location.pathname === ADMIN.MANAGE_BANNERS;
  }

  const isUserRoute = (): boolean => {
    return location.pathname === ADMIN.AUDIT_LOG || location.pathname === ADMIN.MANAGE_USERS;
  }

  const isBookRoute = (): boolean => {
    return location.pathname === ADMIN.ADD_BOOK || location.pathname === ADMIN.MANAGE_BOOKS;
  }

  const isAuthorRoute = (): boolean => {
    return location.pathname === ADMIN.ADD_AUTHOR || location.pathname === ADMIN.MANAGE_AUTHORS;
  }

  return (
    <section className="flex bg-gray-50 min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-white shadow-xl border-r border-gray-200">
        {/* Logo */}
        <Link to={ADMIN.DASHBOARD} className="flex items-center justify-center h-20 bg-white hover:bg-gray-50 transition-colors px-4 border-b border-gray-200">
          <svg
            viewBox="0 0 560 130"
            className="w-full h-auto max-w-[180px] text-black"
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
        
        {/* Navigation */}
        <div className="flex-grow flex flex-col justify-between py-8 overflow-y-auto">
          <nav className="flex flex-col space-y-2 px-4">
            <Link 
              to={ADMIN.DASHBOARD} 
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive(ADMIN.DASHBOARD)
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LuLayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link 
              to={ADMIN.CATEGORIES} 
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive(ADMIN.CATEGORIES)
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MdOutlineCategory className="w-5 h-5" />
              <span>Categories</span>
            </Link>

            {/* Banners Section */}
            <div className="space-y-1">
              <button
                onClick={() => setBannersOpen(!bannersOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
                  isBannerRoute()
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaImages className="w-5 h-5"/>
                  <span>Banners</span>
                </div>
                {bannersOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
              </button>
              
              {bannersOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  <Link 
                    to={ADMIN.ADD_BANNER}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive(ADMIN.ADD_BANNER)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <HiViewGridAdd className="w-4 h-4"/>
                    <span>Add Banner</span>
                  </Link>
                  
                  <Link 
                    to={ADMIN.MANAGE_BANNERS}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive(ADMIN.MANAGE_BANNERS)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <MdOutlineManageHistory className="w-4 h-4"/>
                    <span>Manage Banners</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Users Section */}
            <div className="space-y-1">
              <button
                onClick={() => setUsersOpen(!usersOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
                  isUserRoute()
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaUsersCog className="w-5 h-5" />
                  <span>Users</span>
                </div>
                {usersOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
              </button>
              
              {usersOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  <Link 
                    to={ADMIN.MANAGE_USERS} 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive(ADMIN.MANAGE_USERS)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MdOutlineManageHistory className="w-5 h-5" />
                    <span>Manage Users</span>
                  </Link>
                  <Link 
                    to={ADMIN.AUDIT_LOG} 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive(ADMIN.AUDIT_LOG)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <AiOutlineAudit className="w-5 h-5" />
                    <span>Audit Log</span>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Orders Section */}
            <Link 
              to={ADMIN.ORDERS} 
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive(ADMIN.ORDERS)
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MdOutlineListAlt className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            
            {/* Books Section */}
            <div className="space-y-1">
              <button
                onClick={() => setBooksOpen(!booksOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
                  isBookRoute()
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaBookOpen className="w-5 h-5"/>
                  <span>Books</span>
                </div>
                {booksOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
              </button>
              
              {booksOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  <Link 
                    to={ADMIN.ADD_BOOK}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive(ADMIN.ADD_BOOK)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <HiViewGridAdd className="w-4 h-4"/>
                    <span>Add Book</span>
                  </Link>
                  
                  <Link 
                    to={ADMIN.MANAGE_BOOKS}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive(ADMIN.MANAGE_BOOKS)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <MdOutlineManageHistory className="w-4 h-4"/>
                    <span>Manage Books</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Authors Section */}
            <div className="space-y-1">
              <button
                onClick={() => setAuthorsOpen(!authorsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
                  isAuthorRoute()
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaUserEdit className="w-5 h-5"/>
                  <span>Authors</span>
                </div>
                {authorsOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
              </button>
              
              {authorsOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  <Link 
                    to={ADMIN.ADD_AUTHOR}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive(ADMIN.ADD_AUTHOR)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <HiViewGridAdd className="w-4 h-4"/>
                    <span>Add Author</span>
                  </Link>

                  <Link 
                    to={ADMIN.MANAGE_AUTHORS}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive(ADMIN.MANAGE_AUTHORS)
                        ? 'bg-black text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <MdOutlineManageHistory className="w-4 h-4"/>
                    <span>Manage Authors</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={closeMobileSidebar}
          />
          
          {/* Mobile Menu */}
          <aside className="fixed top-0 left-0 w-64 h-full bg-gray-900 shadow-xl z-50 sm:hidden transform transition-transform overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between h-20 px-4 bg-black">
              <svg
                viewBox="0 0 560 130"
                className="w-32 h-auto text-white"
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
              <button 
                onClick={closeMobileSidebar}
                className="p-2 text-white hover:bg-gray-800 rounded-lg"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-4 space-y-2">
              <Link 
                to={ADMIN.DASHBOARD}
                onClick={closeMobileSidebar}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                  isActive(ADMIN.DASHBOARD)
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <LuLayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link 
                to={ADMIN.CATEGORIES}
                onClick={closeMobileSidebar}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(ADMIN.CATEGORIES)
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <MdOutlineCategory className="w-5 h-5" />
                <span>Categories</span>
              </Link>

              {/* Banners Section Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setBannersOpen(!bannersOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                    isBannerRoute()
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FaBookOpen className="w-5 h-5"/>
                    <span>Banners</span>
                  </div>
                  {bannersOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                </button>
                
                {bannersOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-4">
                    <Link 
                      to={ADMIN.ADD_BANNER}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.ADD_BANNER)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <HiViewGridAdd className="w-4 h-4"/>
                      <span>Add Banner</span>
                    </Link>
                    
                    <Link 
                      to={ADMIN.MANAGE_BANNERS}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.MANAGE_BANNERS)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <MdOutlineManageHistory className="w-4 h-4"/>
                      <span>Manage Banners</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Users Section Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setUsersOpen(!usersOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                    isBannerRoute()
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FaUsersCog className="w-5 h-5"/>
                    <span>Users</span>
                  </div>
                  {usersOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                </button>
                
                {usersOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-4">
                    <Link 
                      to={ADMIN.MANAGE_USERS}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.MANAGE_USERS)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <MdOutlineManageHistory className="w-4 h-4"/>
                      <span>Manage Users</span>
                    </Link>
                    
                    <Link 
                      to={ADMIN.AUDIT_LOG}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.AUDIT_LOG)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <AiOutlineAudit className="w-4 h-4"/>
                      <span>Audit Log</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                to={ADMIN.ORDERS}
                onClick={closeMobileSidebar}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(ADMIN.ORDERS)
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <MdOutlineListAlt className="w-5 h-5" />
                <span>Orders</span>
              </Link>
              
              {/* Books Section Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setBooksOpen(!booksOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                    isBookRoute()
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FaBookOpen className="w-5 h-5"/>
                    <span>Books</span>
                  </div>
                  {booksOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                </button>
                
                {booksOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-4">
                    <Link 
                      to={ADMIN.ADD_BOOK}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.ADD_BOOK)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <HiViewGridAdd className="w-4 h-4"/>
                      <span>Add Book</span>
                    </Link>
                    
                    <Link 
                      to={ADMIN.MANAGE_BOOKS}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.MANAGE_BOOKS)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <MdOutlineManageHistory className="w-4 h-4"/>
                      <span>Manage Books</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Authors Section Mobile */}
              <div className="space-y-1">
                <button
                  onClick={() => setAuthorsOpen(!authorsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                    isAuthorRoute()
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FaUserEdit className="w-5 h-5"/>
                    <span>Authors</span>
                  </div>
                  {authorsOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                </button>
                
                {authorsOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-4">
                    <Link 
                      to={ADMIN.ADD_AUTHOR}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.ADD_AUTHOR)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <HiViewGridAdd className="w-4 h-4"/>
                      <span>Add Author</span>
                    </Link>

                    <Link 
                      to={ADMIN.MANAGE_AUTHORS}
                      onClick={closeMobileSidebar}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        isActive(ADMIN.MANAGE_AUTHORS)
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <MdOutlineManageHistory className="w-4 h-4"/>
                      <span>Manage Authors</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200 shadow-sm">
          {/* Mobile Menu & Search */}
          <div className="flex items-center flex-1">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sm:hidden p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            
            <div className="relative w-full max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search books, orders, customers..." 
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-3 ml-6">
            {/* User Profile */}
            <button className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800">{admin?.username}</p>
                <p className="text-xs text-gray-500">{admin?.role}</p>
              </div>
              <img 
                src={avatarImage} 
                alt="Profile" 
                className="w-10 h-10 rounded-full ring-2 ring-gray-200"
              />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-8 overflow-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
              <p className="text-gray-600">Manage your bookstore inventory and orders</p>
            </div>
          </div>

          {/* Outlet for nested routes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ScrollToTop />
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  )
}

export default DashboardLayout;