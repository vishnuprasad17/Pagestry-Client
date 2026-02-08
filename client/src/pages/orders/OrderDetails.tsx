import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetSingleOrderQuery,
  useCancelOrderMutation,
} from "../../redux/features/orders/orderApi";
import toast from "react-hot-toast";
import {
  FaCalendar,
  FaDownload,
  FaMapPin,
  FaPhone,
  FaTruck,
  FaUser,
} from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { GoPackage } from "react-icons/go";
import { HiChevronLeft, HiExclamationCircle } from "react-icons/hi";
import OrderStatusBar from "./OrderStatusBar";
import OrderProductCard from "./OrderProductCard";
import Invoice from "../../components/Invoice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";
import { USER } from "../../constants/nav-routes/userRoutes";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldShowCancelDialog = searchParams.get("action") === "cancel";

  const [showCancelDialog, setShowCancelDialog] = useState(
    shouldShowCancelDialog,
  );
  const [cancellationReason, setCancellationReason] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);

  const { data: order, isLoading, error } = useGetSingleOrderQuery(id!, { skip: !id });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      await cancelOrder({ orderId: id!, reason: cancellationReason }).unwrap();
      toast.success("Order cancelled successfully");
      setShowCancelDialog(false);
      setCancellationReason("");
    } catch (err) {
      const error = err as FetchBaseQueryError & {
        data?: { message?: string };
      };
      toast.error(error?.data?.message || "Failed to cancel order");
    }
  };

  const formatDate = (date: string | Date): string => {
    return dayjs(date).format("MMMM, D, YYYY");
  };

  const getPaymentStatusBadge = () => {
    if (!order?.paymentDetails) return null;

    const { status, method } = order.paymentDetails;
    const configs = {
      SUCCESS: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Payment Pending",
      },
      FAILED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Payment Failed",
      },
      REFUNDED: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Refunded",
      },
    };

    const config = configs[status] || configs.PENDING;

    return (
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}
        >
          {config.label}
        </span>
        <span className="text-sm text-gray-600">
          via {method === "COD" ? "Cash on Delivery" : "Online Payment"}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <HiExclamationCircle className="mx-auto text-5xl text-red-500 mb-3" />
            <p className="text-red-600 font-medium text-lg">Order not found</p>
            <p className="text-red-500 text-sm mt-1">
              This order doesn't exist or you don't have access to it
            </p>
            <button
              onClick={() => navigate(USER.ORDERS)}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = ["PENDING", "PLACED", "CONFIRMED"].includes(order.status);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(USER.ORDERS)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <HiChevronLeft className="text-xl" />
          <span className="font-medium">Back to Orders</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details - {order.orderId}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <FaCalendar className="w-4 h-4" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
              <div className="mt-2">{getPaymentStatusBadge()}</div>
            </div>
            <div className="flex items-center gap-3">
              {canCancel && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              )}
              {order.status === "DELIVERED" && (
                <button
                  onClick={() => setShowInvoice(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <FaDownload className="w-4 h-4" />
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Status */}
        <OrderStatusBar currentStatus={order.status} />

        {/* Payment & Delivery Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Customer Information
              </h3>
            </div>
            <div className="space-y-3 px-2">
              <div className="flex items-start gap-3">
                <FaUser className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TfiEmail className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaMapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Delivery Address
              </h3>
            </div>
            <div className="space-y-1 px-4">
              <p className="font-medium text-gray-900">
                {order.shippingAddress.addressLine1}
              </p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-gray-600">
                  {order.shippingAddress.addressLine2}
                </p>
              )}
              {order.shippingAddress.landmark && (
                <p className="text-sm text-gray-500">
                  Landmark: {order.shippingAddress.landmark}
                </p>
              )}
              <p className="text-gray-600">
                {order.shippingAddress.city} - {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.state}</p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Delivery Partner */}
        {order.deliveryDetails && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <FaTruck className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Delivery Partner
              </h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Partner</p>
                <p className="font-semibold text-gray-900">
                  {order.deliveryDetails.partner}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tracking ID</p>
                <p className="font-mono font-semibold text-indigo-600">
                  {order.deliveryDetails.trackingId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(order.deliveryDetails.estimatedDeliveryDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Info */}
        {order.status === "CANCELLED" && order.cancellationInfo?.reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <HiExclamationCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  Order Cancelled
                </h3>
                <p className="text-sm text-red-700">
                  <span className="font-medium">Reason:</span>{" "}
                  {order.cancellationInfo.reason}
                </p>
                {order.cancellationInfo.cancelledAt && (
                  <p className="text-sm text-red-600 mt-1">
                    Cancelled on{" "}
                    {formatDate(order.cancellationInfo.cancelledAt)}
                  </p>
                )}
                {order.paymentDetails?.status === "REFUNDED" && (
                  <p className="text-sm text-red-700 mt-2 font-medium">
                    ✓ Refund has been initiated
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
          {order.items.map((product) => (
            <OrderProductCard
              key={product.bookId}
              product={product}
              orderStatus={order.status}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <GoPackage className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">
              Order Summary
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₹{order.subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Delivery Charge</span>
              <span className={`font-semibold ${order.deliveryCharge === 0 ? "text-xs text-green-600" : "text-gray-900"}`}>
                {order.deliveryCharge === 0 ? "FREE DELIVERY" : `₹${order.deliveryCharge.toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-lg font-bold text-gray-900">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₹
                {(order.totalPrice).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {order.paymentDetails?.method === "COD" &&
              order.paymentDetails?.status === "PENDING" && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">
                    💵 Pay ₹
                    {(order.totalPrice).toLocaleString(
                      "en-IN",
                    )}{" "}
                    in cash upon delivery
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cancel Order
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for cancelling this order:
            </p>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter your reason..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || !cancellationReason.trim()}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancellationReason("");
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && (
        <Invoice order={order} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default OrderDetails;
