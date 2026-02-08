import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/useAuth";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { USER } from "../../constants/nav-routes/userRoutes";

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { getProviderId } = useAuth();
  const providerId = getProviderId();
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------- Header Section ---------- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Profile Avatar - Show image if available, otherwise show initial */}
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || "User"}
                className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-2xl font-bold text-white shadow-md">
                {firstLetter}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Hello, {user?.name || "User"}
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Main Content ---------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ---------- Quick Actions Grid ---------- */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            providerId !== "password" ? "lg:grid-cols-2" : "lg:grid-cols-3"
          } gap-4 mb-8`}
        >
          {/* Orders Card */}
          <Link
            to={USER.ORDERS}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Your Orders
                </h3>
                <p className="text-sm text-gray-500">
                  Track, return, or buy things again
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Wishlist Card */}
          <Link
            to={USER.WISHLIST}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Your Wishlist
                </h3>
                <p className="text-sm text-gray-500">
                  View and manage saved items
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Security Card */}
          {providerId === "password" && (
            <Link
              to={USER.CHANGE_PASSWORD}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Login & Security
                  </h3>
                  <p className="text-sm text-gray-500">
                    Change password and manage security
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          )}
        </div>

        {/* ---------- Account Settings Section ---------- */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Account Settings
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Edit Profile */}
            <Link to="/user-dashboard/edit-profile">
              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Edit Profile
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Update your name and personal information
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>

            {/* Addresses */}
            <Link to={USER.ADDRESS}>
              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Your Addresses
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Edit addresses for orders and gifts
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* ---------- Help Section ---------- */}
        <div className="mt-8">
          <div className="bg-blue-50 rounded-lg border border-blue-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Browse our help topics or contact customer service
                </p>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Visit Help Center →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;