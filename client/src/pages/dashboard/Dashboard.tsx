import React, { useState } from 'react';
import { 
  HiClock, 
  HiCheckCircle,
  HiShoppingCart,
  HiCurrencyRupee,
  HiChartBar,
  HiUserGroup,
  HiTrendingUp,
  HiCalendar
} from 'react-icons/hi';
import Loading from '../../components/Loading';
import avatarImage from '../../assets/avatar.png';
import RevenueChart from './RevenueChart';
import { 
  useGetDailyReportQuery, 
  useGetOrderStatsQuery, 
  useGetRevenueAnalyticsQuery 
} from '../../redux/features/admin/adminApi';
import { ShimmerCard, ShimmerList, ShimmerTable } from '../../components/skeleton/DashboardSkeleton';

interface CurrentMonthDates {
  start: string;
  end: string;
}

const Dashboard: React.FC = () => {
  // Format date to MongoDB ISO format (YYYY-MM-DD)
  const formatDateForMongoDB = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Initialize with current month date range
  const getCurrentMonthDates = (): CurrentMonthDates => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: formatDateForMongoDB(firstDay),
      end: formatDateForMongoDB(lastDay)
    };
  };

  const monthDates = getCurrentMonthDates();
  const [startDate, setStartDate] = useState<string>(monthDates.start);
  const [endDate, setEndDate] = useState<string>(monthDates.end);
  const [dailyReportDate, setDailyReportDate] = useState<string>(formatDateForMongoDB(new Date()));

  const { data: statsDataResponse, isLoading } = useGetOrderStatsQuery();
  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueAnalyticsQuery({
    startDate: startDate,
    endDate: endDate
  });
  const { data: dailyReport, isLoading: dailyReportLoading } = useGetDailyReportQuery(dailyReportDate);

  const stats = statsDataResponse?.orderStats;
  const topUsers = statsDataResponse?.topCustomers ?? [];
  const totalBooks = statsDataResponse?.totalBooks ?? 0;
  const { summary, dailyBreakdown } = revenueData || {};

  if (isLoading) return <Loading />;

  const allLoading = isLoading || revenueLoading || dailyReportLoading || !stats;

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(formatDateForMongoDB(e.target.value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(formatDateForMongoDB(e.target.value));
  };

  const handleDailyReportDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDailyReportDate(formatDateForMongoDB(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your business overview</p>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allLoading ? (
            <>
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Books</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalBooks || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <HiChartBar className="text-2xl text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <HiShoppingCart className="text-2xl text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <HiCurrencyRupee className="text-2xl text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Pending Orders</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingOrders || 0}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <HiClock className="text-2xl text-yellow-500" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Daily Report Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Daily Report</h3>
              <p className="text-sm opacity-90">Today's performance overview</p>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <HiCalendar className="text-white text-lg" />
              <input
                type="date"
                value={dailyReportDate}
                onChange={handleDailyReportDateChange}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              />
            </div>
          </div>
          
          {dailyReportLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          ) : dailyReport ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-700 font-medium">Today's Orders</p>
                    <p className="text-2xl font-bold text-indigo-900 mt-1">{dailyReport.totalOrders || 0}</p>
                  </div>
                  <HiShoppingCart className="text-3xl text-indigo-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Today's Revenue</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      ₹{(dailyReport.totalRevenue || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <HiCurrencyRupee className="text-3xl text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700 font-medium">Delivered Today</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">{dailyReport.deliveredOrders || 0}</p>
                  </div>
                  <HiCheckCircle className="text-3xl text-emerald-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">COD Orders</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">{dailyReport.codOrders || 0}</p>
                  </div>
                  <HiCurrencyRupee className="text-3xl text-orange-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">No data available for selected date</div>
          )}
        </div>

        {/* Revenue Analytics Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-between flex-wrap gap-4">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Revenue Analytics</h3>
              <p className="text-sm opacity-90">Revenue performance for selected period</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
                <span className="text-white text-sm font-medium">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
                <span className="text-white text-sm font-medium">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {revenueLoading ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
              <ShimmerTable />
            </div>
          ) : summary ? (
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium">Period Revenue</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        ₹{(summary.totalRevenue || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-green-600 mt-1">{summary.totalOrders || 0} orders</p>
                    </div>
                    <HiTrendingUp className="text-4xl text-green-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Avg Order Value</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        ₹{(summary.avgOrderValue || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Per transaction</p>
                    </div>
                    <HiChartBar className="text-4xl text-blue-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700 font-medium">Payment Split</p>
                      <div className="flex gap-4 mt-1">
                        <div>
                          <p className="text-lg font-bold text-purple-900">
                            ₹{(summary.razorpayRevenue || 0).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-purple-600">Online</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-orange-900">
                            ₹{(summary.codRevenue || 0).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-orange-600">COD</p>
                        </div>
                      </div>
                    </div>
                    <HiCurrencyRupee className="text-4xl text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Daily Breakdown Table */}
              {dailyBreakdown && dailyBreakdown.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Daily Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyBreakdown.map((day, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-white transition-colors">
                            <td className="py-3 px-4 text-sm text-gray-800 font-medium">{day._id}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-right">{day.totalOrders || 0}</td>
                            <td className="py-3 px-4 text-sm text-green-700 font-semibold text-right">
                              ₹{(day.totalRevenue || 0).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">No data available for selected period</div>
          )}
        </div>

        {/* Order Status Overview */}
        {!allLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Placed</span>
                <span className="text-lg font-bold text-blue-600">{stats.placedOrders || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalOrders > 0 ? (stats.placedOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Confirmed</span>
                <span className="text-lg font-bold text-purple-600">{stats.confirmedOrders || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalOrders > 0 ? (stats.confirmedOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Shipped</span>
                <span className="text-lg font-bold text-indigo-600">{stats.shippedOrders || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalOrders > 0 ? (stats.shippedOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Delivered</span>
                <span className="text-lg font-bold text-green-600">{stats.deliveredOrders || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalOrders > 0 ? (stats.deliveredOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Cancelled</span>
                <span className="text-lg font-bold text-red-600">{stats.cancelledOrders || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalOrders > 0 ? (stats.cancelledOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Charts and Users Section */}
        <div className="grid md:grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-lg font-bold text-gray-800">Revenue Overview</h3>
              <p className="text-sm text-gray-500 mt-1">Revenue trends over time (INR)</p>
            </div>
            <div className="p-6" style={{ height: '400px' }}>
              <RevenueChart />
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Top Users</h3>
                <p className="text-sm text-gray-500 mt-1">By average order value</p>
              </div>
              <HiUserGroup className="text-2xl text-gray-400" />
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              {isLoading ? (
                <ShimmerList />
              ) : (
                <ul className="p-6 space-y-4">
                  {topUsers.length > 0 ? (
                    topUsers.map((user, index) => (
                      <li key={user.userId || index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="h-12 w-12 mr-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden ring-2 ring-blue-100 flex items-center justify-center">
                          <img src={user.profileImage || avatarImage} alt={`${user.name} profile`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <p className="text-xs text-gray-600 mt-1">{user.totalOrders} orders • ₹{user.totalSpent?.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="ml-3 text-right">
                          <span className="inline-block font-bold text-sm text-gray-900 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-lg">
                            ₹{user.avgOrderValue?.toLocaleString("en-IN")}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">avg</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-8 text-gray-500">No users data available</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 font-medium">
            Analytics powered by <span className="text-gray-700 font-semibold">Pagestry Publications</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;