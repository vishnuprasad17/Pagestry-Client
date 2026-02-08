import React, { useState } from "react";
import OrderListItem from "./OrderListItem";
import { useGetOrdersQuery } from "../../redux/features/orders/orderApi";
import { useSearchParams } from "react-router-dom";
import { HiShoppingBag, HiFilter } from "react-icons/hi";
import Pagination from "../../components/Pagination";
import { OrderData } from "../../types/order";
import { USER } from "../../constants/nav-routes/userRoutes";

const Orders: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusFilter = searchParams.get("status") || "all";
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { data, isLoading, error } = useGetOrdersQuery(page);

  const updateParams = (updates: Record<string, string | number>) => {
    const params = Object.fromEntries(searchParams.entries());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === 1 || value === "all") {
        delete params[key];
      } else {
        params[key] = String(value);
      }
    });

    setSearchParams(params);
  };

  // Filter orders locally if needed
  const filteredOrders = React.useMemo<OrderData[]>(() => {
    if (!data?.orders) return [];
    if (statusFilter === "all") return data.orders;
    return data.orders.filter(order => order.status === statusFilter);
  }, [data, statusFilter]);

  const orderStats = React.useMemo<Record<string, number>>(() => {
    const stats: Record<string, number> = {};
    data?.orders?.forEach((order) => {
      stats[order.status] = (stats[order.status] || 0) + 1;
    });
    return stats;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load orders</p>
          <p className="text-red-500 text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  
  const { orders = [], totalPages = 1, currentPage = 1, totalOrders } = data || {};

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <HiShoppingBag className="text-4xl" />
              Your Orders
            </h1>
            <p className="text-gray-600 mt-1">
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HiFilter className="text-lg" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by status:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Orders", count: orders.length },
                { value: "PENDING", label: "Pending", count: orderStats.PENDING },
                { value: "PLACED", label: "Placed", count: orderStats.PLACED },
                { value: "CONFIRMED", label: "Confirmed", count: orderStats.CONFIRMED },
                { value: "SHIPPED", label: "Shipped", count: orderStats.SHIPPED },
                { value: "DELIVERED", label: "Delivered", count: orderStats.DELIVERED },
                { value: "CANCELLED", label: "Cancelled", count: orderStats.CANCELLED },
                { value: "FAILED", label: "Failed", count: orderStats.FAILED },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    updateParams({ status: filter.value, page: 1 });
                  }}
                  disabled={!filter.count}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    statusFilter === filter.value
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className="ml-1.5 opacity-75">({filter.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <HiShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {statusFilter === "all" ? "No orders yet" : `No ${statusFilter.toLowerCase()} orders`}
          </h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === "all" 
              ? "Start shopping to see your orders here"
              : "Try selecting a different filter"
            }
          </p>
          {statusFilter === "all" && (
            <button
              onClick={() => window.location.href = USER.HOME}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p: number) => updateParams({ page: p })}
        />
      )}
    </div>
  );
};

export default Orders;