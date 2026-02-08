import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateDeliveryDetailsMutation,
  useProcessRefundMutation,
} from "../../../redux/features/admin/adminApi";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiXCircle,
  HiTruck,
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiCreditCard,
  HiCash,
} from "react-icons/hi";
import { ADMIN } from "../../../constants/nav-routes/adminRoutes";
import dayjs from "dayjs";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { OrderStatus } from "../../../types/order";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

type ConfirmModalState =
  | { isOpen: false; type: null; data: null }
  | { isOpen: true; type: "status"; data: OrderStatus }
  | { isOpen: true; type: "refund"; data: string };

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    partner: "",
    trackingId: "",
    estimatedDeliveryDate: "",
  });

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    type: null,
    data: null,
  });

  if (!id) {
    navigate(ADMIN.ORDERS);
    return null;
  }
  const orderId = id;

  const { data: order, isLoading, refetch } = useGetOrderByIdQuery(orderId);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [updateDelivery, { isLoading: isUpdatingDelivery }] = useUpdateDeliveryDetailsMutation();
  const [processRefund, { isLoading: isProcessingRefund }] = useProcessRefundMutation();


  // Pre-fill delivery data when modal opens
  const handleOpenDeliveryModal = () => {
    if (order && order?.deliveryDetails) {
      setDeliveryData({
        partner: order.deliveryDetails.partner || "",
        trackingId: order.deliveryDetails.trackingId || "",
        estimatedDeliveryDate: order.deliveryDetails.estimatedDeliveryDate 
          ? dayjs(order.deliveryDetails.estimatedDeliveryDate).format("YYYY-MM-DD")
          : "",
      });
    } else {
      setDeliveryData({
        partner: "",
        trackingId: "",
        estimatedDeliveryDate: "",
      });
    }
    setShowDeliveryModal(true);
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setConfirmModal({
      isOpen: true,
      type: 'status',
      data: newStatus,
    });
  };

  const handleRefund = async () => {
    const reason = prompt("Enter refund reason:");
    if (!reason) return;

    setConfirmModal({
      isOpen: true,
      type: 'refund',
      data: reason,
    });
  };

  const handleConfirmAction = async () => {
    const { type, data } = confirmModal;

    try {
      if (type === 'status') {
        await updateStatus({ orderId, status: data }).unwrap();
        toast.success("Status updated successfully");
      } else if (type === 'refund') {
        await processRefund({ orderId, amount: order?.paymentDetails.amount!, reason: data }).unwrap();
        toast.success("Refund processed successfully");
      }
      refetch();
      setConfirmModal({ isOpen: false, type: null, data: null });
    } catch (error) {
      toast.error(getApiErrorMessage(error, `Failed to ${type === 'status' ? 'update status' : 'process refund'}`));
    }
  };

  const handleDeliveryUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await updateDelivery({ orderId, deliveryDetails: deliveryData }).unwrap();
      toast.success("Delivery details updated successfully");
      setShowDeliveryModal(false);
      refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update delivery details"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Order not found
        </div>
      </div>
    );
  }

  const statusOptions = ["PENDING", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  // Get modal content based on type
  const getModalContent = () => {
    if (confirmModal.type === 'status') {
      return {
        title: "Change Order Status",
        message: `Are you sure you want to change the order status to ${confirmModal.data}?`,
        confirmText: "Change Status",
        confirmButtonClass: "bg-blue-600 hover:bg-blue-700",
      };
    } else if (confirmModal.type === 'refund') {
      return {
        title: "Process Refund",
        message: "Are you sure you want to process a refund? This action cannot be undone.",
        confirmText: "Process Refund",
        confirmButtonClass: "bg-red-600 hover:bg-red-700",
      };
    }
    return {};
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ADMIN.ORDERS)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <HiArrowLeft />
          Back to Orders
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order ID: {order.orderId}</p>
          </div>
          <div className="flex gap-2">
            {order.paymentDetails.method === "RAZORPAY" &&
              order.paymentDetails.status === "SUCCESS" &&
              order.status !== "CANCELLED" && (
                <button
                  onClick={handleRefund}
                  disabled={isProcessingRefund}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Process Refund
                </button>
              )}
            {["CONFIRMED", "SHIPPED"].includes(order.status) && (
              <button
                onClick={handleOpenDeliveryModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {order.deliveryDetails ? "Edit Delivery" : "Add Delivery"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="flex items-center gap-4">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
                disabled={isUpdatingStatus || order.status === "DELIVERED" || order.status === "CANCELLED"}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-500">
                {dayjs(order.createdAt).format("D MMMM YYYY, h:mm A")}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.bookId} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  {item.coverImage && (
                    <img
                      src={item.coverImage}
                      alt={item.title || "Book"}
                      className="w-16 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.title || "Book"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.unitPrice.toLocaleString("en-IN")} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{order.totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          {order.deliveryDetails && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Delivery Details</h2>
                <HiTruck className="text-2xl text-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Partner:</span>
                  <span className="font-medium">{order.deliveryDetails.partner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking ID:</span>
                  <span className="font-mono font-medium">{order.deliveryDetails.trackingId}</span>
                </div>
                {order.deliveryDetails.estimatedDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">
                      {dayjs(order.deliveryDetails.estimatedDeliveryDate).format("DD MMMM YYYY")}
                    </span>
                  </div>
                )}
                {order.deliveryDetails.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered At:</span>
                    <span className="font-medium">
                      {dayjs(order.deliveryDetails.deliveredAt).format("D MMMM YYYY, h:mm A")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <HiMail className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <HiLocationMarker className="text-xl text-gray-600" />
              <h2 className="text-lg font-semibold">Shipping Address</h2>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
              )}
              {order.shippingAddress.landmark && (
                <p className="text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
              )}
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <HiPhone className="text-gray-400" />
                <p className="font-medium">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              {order.paymentDetails.method === "RAZORPAY" ? (
                <HiCreditCard className="text-xl text-gray-600" />
              ) : (
                <HiCash className="text-xl text-gray-600" />
              )}
              <h2 className="text-lg font-semibold">Payment Details</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">{order.paymentDetails.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  order.paymentDetails.status === "SUCCESS"
                    ? "text-green-600"
                    : order.paymentDetails.status === "FAILED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  {order.paymentDetails.status}
                </span>
              </div>
              {order.paymentDetails.razorpayOrderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Razorpay Order ID:</span>
                  <span className="font-mono text-xs">{order.paymentDetails.razorpayOrderId}</span>
                </div>
              )}
              {order.paymentDetails.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-xs">{order.paymentDetails.razorpayPaymentId}</span>
                </div>
              )}
              {order.paymentDetails.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid At:</span>
                  <span className="font-medium">
                    {new Date(order.paymentDetails.paidAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Details */}
          {order.status === "CANCELLED" && order.cancellationInfo && (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <HiXCircle className="text-xl text-red-600" />
                <h2 className="text-lg font-semibold text-red-900">Cancellation Details</h2>
              </div>
              <p className="text-sm text-red-800 mt-2">{order.cancellationInfo.reason}</p>
              {order.cancellationInfo.cancelledAt && (
                <p className="text-xs text-red-600 mt-1">
                  Cancelled on: {new Date(order.cancellationInfo.cancelledAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {order.deliveryDetails ? "Edit Delivery Details" : "Add Delivery Details"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Partner
                </label>
                <input
                  type="text"
                  required
                  value={deliveryData.partner}
                  onChange={(e) => setDeliveryData({ ...deliveryData, partner: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Blue Dart, DTDC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking ID
                </label>
                <input
                  type="text"
                  required
                  value={deliveryData.trackingId}
                  onChange={(e) => setDeliveryData({ ...deliveryData, trackingId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tracking number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryData.estimatedDeliveryDate}
                  onChange={(e) => setDeliveryData({ ...deliveryData, estimatedDeliveryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeliveryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeliveryUpdate}
                  disabled={isUpdatingDelivery}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {isUpdatingDelivery ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, data: null })}
        onConfirm={handleConfirmAction}
        isLoading={confirmModal.type === 'status' ? isUpdatingStatus : isProcessingRefund}
        {...getModalContent()}
      />
    </div>
  );
};

export default AdminOrderDetail;