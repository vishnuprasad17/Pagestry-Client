import React, { useState } from 'react';
import { useBlockUserMutation, useFetchUsersQuery, useUnblockUserMutation } from '../../../redux/features/admin/adminApi';
import { FaSearch, FaFilter } from 'react-icons/fa'
import { FiShield, FiShieldOff } from 'react-icons/fi';
import { LuArrowUpDown } from 'react-icons/lu';
import Pagination from '../../../components/Pagination';
import UserSkeleton from '../../../components/skeleton/UsersListSkeleton';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const ManageUsers: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  
  const { data: userResponse, isLoading } = useFetchUsersQuery({
    page,
    filter,
    sort,
    search
  });
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  const handleBlockToggle = async (userUid: string, isBlocked: boolean) => {
    if (isBlocked) {
      const res = await unblockUser(userUid).unwrap();
      toast.success(res?.data?.message || "User unblocked successfully!");
    } else {
      const res = await blockUser(userUid).unwrap();
      toast.success(res?.data?.message || "User blocked successfully!");
    }
  };

  const users = userResponse?.users ?? [];
  const totalPages = userResponse?.totalPages ?? 1;
  const currentPage = userResponse?.currentPage ?? 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">View and manage user accounts</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">All Users</option>
                <option value="blocked">Blocked Only</option>
                <option value="unblocked">Unblocked Only</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <LuArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">Sort by Name</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => <UserSkeleton key={i} />)}
            </>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <div className="text-gray-400 mb-4">
                <FaSearch className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      {user.isBlocked && (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      Joined {dayjs(user.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBlockToggle(user.firebaseUid, user.isBlocked)}
                    disabled={isBlocking || isUnblocking}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      user.isBlocked
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {user.isBlocked ? (
                      <>
                        <FiShieldOff className="w-4 h-4" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <FiShield className="w-4 h-4" />
                        Block
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;