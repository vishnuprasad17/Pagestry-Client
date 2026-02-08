import React, { useState } from "react";
import { 
  useGetAllOrdersQuery, 
  useUpdateOrderStatusMutation
} from "../../../redux/features/admin/adminApi";
import { 
  HiSearch, 
  HiFilter, 
  HiDownload,
  HiEye,
  HiChevronDown,
  HiChevronUp
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ConfirmModal } from "../../../components/ConfirmModal";
import Pagination from "../../../components/Pagination";
import { ADMIN } from "../../../constants/nav-routes/adminRoutes";
import { OrderStatus, PaymentStatus } from "../../../types/order";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface Filter {
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
}

const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filter>({
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    orderId: string;
    newStatus: OrderStatus;
  }>({
    isOpen: false,
    orderId: "",
    newStatus: "PENDING",
  });

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    page,
    limit: 20,
    search: searchQuery,
    ...filters,
  });

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 1;

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setConfirmModal({
      isOpen: true,
      orderId,
      newStatus,
    });
  };

  const confirmStatusUpdate = async () => {
    try {
      await updateOrderStatus({ 
        orderId: confirmModal.orderId, 
        status: confirmModal.newStatus 
      }).unwrap();
      toast.success("Order status updated successfully");
      refetch();
      setConfirmModal({ isOpen: false, orderId: "", newStatus: "PENDING" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update order status"));
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleFilterChange = <K extends keyof Filter>(key: K, value: Filter[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      paymentStatus: "",
      paymentMethod: "",
      startDate: "",
      endDate: "",
    });
    setSearchQuery("");
    setPage(1);
  };

  const exportOrders = () => {
    const csv = [
      ["Order ID", "Customer", "Email", "Date", "Total", "Status", "Payment", "Payment Method"].join(","),
      ...orders.map(order => [
        order.orderId,
        order.shippingAddress.fullName,
        order.email,
        new Date(order.createdAt).toLocaleDateString(),
        order.totalPrice,
        order.status,
        order.paymentDetails.status,
        order.paymentDetails.method
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Orders exported successfully");
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      PLACED: "bg-blue-100 text-blue-800 border-blue-300",
      CONFIRMED: "bg-green-100 text-green-800 border-green-300",
      SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
      DELIVERED: "bg-green-200 text-green-900 border-green-400",
      CANCELLED: "bg-red-100 text-red-800 border-red-300",
      FAILED: "bg-red-200 text-red-900 border-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors = {
      PENDING: "bg-yellow-50 text-yellow-700",
      SUCCESS: "bg-green-50 text-green-700",
      FAILED: "bg-red-50 text-red-700",
      REFUNDED: "bg-purple-50 text-purple-700",
    };
    return colors[status] || "bg-gray-50 text-gray-700";
  };

  const statusOptions = ["PENDING", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, orderId: "", newStatus: "PENDING" })}
        onConfirm={confirmStatusUpdate}
        isLoading={isUpdating}
        title="Update Order Status"
        message={`Are you sure you want to change the order status to ${confirmModal.newStatus}?`}
        confirmText="Update"
        cancelText="Cancel"
        confirmButtonClass="bg-black hover:bg-gray-800"
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <HiFilter />
              Filters
            </button>
            <button
              onClick={exportOrders}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <HiDownload />
              Export
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Payment Status</option>
              <option value="PENDING">PENDING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>

            <select
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Methods</option>
              <option value="RAZORPAY">RAZORPAY</option>
              <option value="COD">COD</option>
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="End Date"
            />
          </div>
        )}

        {/* Active Filters */}
        {(filters.status || filters.paymentStatus || filters.paymentMethod || searchQuery) && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active Filters:</span>
            {filters.status && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Status: {filters.status}
              </span>
            )}
            {filters.paymentStatus && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Payment: {filters.paymentStatus}
              </span>
            )}
            {filters.paymentMethod && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Method: {filters.paymentMethod}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Search: {searchQuery}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedOrder === order.id ? <HiChevronUp /> : <HiChevronDown />}
                          </button>
                          <span className="font-mono text-sm font-semibold">{order.orderId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{order.shippingAddress.fullName}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-sm">
                          ₹{order.totalPrice.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentDetails.status)}`}>
                            {order.paymentDetails.status}
                          </span>
                          <span className="text-xs text-gray-500">{order.paymentDetails.method}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.orderId, e.target.value as OrderStatus)}
                          disabled={isUpdating || order.status === "DELIVERED" || order.status === "CANCELLED"}
                          className={`px-3 py-1 rounded-md text-xs font-semibold border ${getStatusColor(order.status)} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`${ADMIN.ORDERS}/${order.orderId}`)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <HiEye />
                          View
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Details */}
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={8} className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-700">{order.shippingAddress.fullName}</p>
                              <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
                              {order.shippingAddress.addressLine2 && (
                                <p className="text-sm text-gray-600">{order.shippingAddress.addressLine2}</p>
                              )}
                              <p className="text-sm text-gray-600">
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                              </p>
                              <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.bookId} className="flex justify-between text-sm">
                                    <span className="text-gray-700">
                                      {item.title} × {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;