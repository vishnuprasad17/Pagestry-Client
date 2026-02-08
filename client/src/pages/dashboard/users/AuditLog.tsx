import React, { useState } from "react";
import { useFetchAuditLogsQuery } from "../../../redux/features/admin/adminApi";
import {
  FaSearch,
  FaFilter,
  FaUserCheck,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { FiShield, FiUserX } from "react-icons/fi";
import Pagination from "../../../components/Pagination";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AuditLogSkeleton from "../../../components/skeleton/AuditLogSkeleton";
dayjs.extend(relativeTime);

const AuditLog: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const { data: auditLogResponse, isLoading } = useFetchAuditLogsQuery({
    page,
    filter,
    search,
  });

  const auditLogs = auditLogResponse?.auditLogs ?? [];
  const totalPages = auditLogResponse?.totalPages ?? 0;
  const currentPage = auditLogResponse?.currentPage ?? 1;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-900 rounded-lg">
              <FiShield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Audit Logs</h1>
          </div>
          <p className="text-slate-600">
            Track all administrative actions and user management activities
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user or admin name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Filter */}
            <div className="relative min-w-[200px]">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition"
              >
                <option value="">All Actions</option>
                <option value="BLOCK_USER">Block User</option>
                <option value="UNBLOCK_USER">Unblock User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-slate-200">
              <AuditLogSkeleton />
              <AuditLogSkeleton />
              <AuditLogSkeleton />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <FiShield className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No audit logs found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Action Icon */}
                    <div
                      className={`p-3 rounded-lg ${
                        log.action === "BLOCK_USER"
                          ? "text-red-600 bg-red-50"
                          : "text-green-600 bg-green-50"
                      }`}
                    >
                      {log.action === "BLOCK_USER" ? (
                        <FiUserX className="w-4 h-4" />
                      ) : (
                        <FaUserCheck className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-slate-800 mb-1">
                            {log.action === "BLOCK_USER"
                              ? "Blocked User"
                              : "Unblocked User"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaClock className="w-4 h-4" />
                            <span>{dayjs(log.createdAt).fromNow()}</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            log.action === "BLOCK_USER"
                              ? "text-red-600 bg-red-50"
                              : "text-green-600 bg-green-50"
                          }`}
                        >
                          {log.action.replace("_", " ")}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {/* Target User */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-black rounded-full font-semibold text-sm">
                            <FaUser className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 mb-0.5">
                              Target User
                            </p>
                            <p className="font-medium text-slate-800 truncate">
                              {log.user?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-slate-600 truncate">
                              @{log.user?.username || "unknown"}
                            </p>
                          </div>
                        </div>

                        {/* Performed By */}
                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                          <div className="flex items-center justify-center w-10 h-10 bg-amber-100 text-amber-600 rounded-full">
                            <FiShield className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 mb-0.5">
                              Performed By
                            </p>
                            <p className="font-medium text-slate-800 truncate">
                              {log.admin?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-slate-600 truncate">
                              @{log.admin?.username || "unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

export default AuditLog;
