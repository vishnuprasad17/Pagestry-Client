import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useFetchMonthlyRevenueQuery, useFetchYearlyRevenueQuery } from '../../redux/features/admin/adminApi';
import { MonthlyRevenueDto } from '../../types/admin';

const RevenueChart: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [chartType, setChartType] = useState<'monthly' | 'yearly'>('monthly');

  const { data: monthlyData, isLoading: monthlyLoading, isError: monthlyError } = useFetchMonthlyRevenueQuery(selectedYear);
  const { data: yearlyData, isLoading: yearlyLoading, isError: yearlyError } = useFetchYearlyRevenueQuery();

  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`; // Crore format
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`; // Lakh format
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`; // Thousand format
    }
    return `₹${value}`;
  };

  // Generate year options for dropdown (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Loading state
  if ((chartType === 'monthly' && monthlyLoading) || (chartType === 'yearly' && yearlyLoading)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-500 text-sm">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if ((chartType === 'monthly' && monthlyError) || (chartType === 'yearly' && yearlyError) || !monthlyData || !yearlyData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-semibold mb-2">Failed to load revenue data</p>
          <p className="text-gray-500 text-sm">Please try again later or contact support</p>
        </div>
      </div>
    );
  }

  // Get current data based on chart type
  const currentData = chartType === 'monthly' ? monthlyData : yearlyData;
  const revenueData = chartType === 'monthly' ? currentData?.data : currentData?.data;
  const summary = chartType === 'monthly' ? (currentData as MonthlyRevenueDto)?.summary : null;

  // Calculate yearly summary if viewing yearly data
  const yearlySummary = chartType === 'yearly' && yearlyData?.data ? {
    totalRevenue: yearlyData.data.reduce((sum, item) => sum + item.revenue, 0),
    totalOrders: yearlyData.data.reduce((sum, item) => sum + item.orders, 0),
  } : null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4 px-2 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => setChartType('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                chartType === 'monthly'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setChartType('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                chartType === 'yearly'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly
            </button>
          </div>

          {/* Year Selector (only for monthly view) */}
          {chartType === 'monthly' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>

        {/* Summary Stats */}
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-green-600">
              {chartType === 'monthly' 
                ? `₹${summary?.totalRevenue?.toLocaleString('en-IN')}` 
                : `₹${yearlySummary?.totalRevenue?.toLocaleString('en-IN')}`
              }
            </p>
          </div>
          {chartType === 'monthly' && summary && (
            <div className="text-right border-l pl-6">
              <p className="text-xs text-gray-500 mb-1">Avg. Monthly</p>
              <p className="text-xl font-semibold text-gray-700">
                ₹{summary.averageMonthlyRevenue?.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'monthly' ? (
          <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              formatter={(value) => [`₹${value!.toLocaleString('en-IN')}`, 'Revenue']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="revenue" 
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
              name="Monthly Revenue (INR)"
              maxBarSize={60}
            />
          </BarChart>
        ) : (
          <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip 
              formatter={(value) => [`₹${value!.toLocaleString('en-IN')}`, 'Revenue']}
              labelFormatter={(label) => `Year: ${label}`}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 6 }}
              activeDot={{ r: 8 }}
              name="Yearly Revenue (INR)"
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Additional Info */}
      {chartType === 'monthly' && summary && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Orders ({selectedYear}): <strong className="text-gray-800">{summary.totalOrders}</strong></span>
            <span>Avg per Order: <strong className="text-gray-800">₹{Math.round(summary.totalRevenue / summary.totalOrders || 0).toLocaleString('en-IN')}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;