import React from "react";
import { Link } from "react-router-dom";
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiClock, 
  HiTruck,
  HiCreditCard,
  HiCash
} from "react-icons/hi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { OrderData, OrderStatus, PaymentStatus } from "../../types/order";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  order: OrderData
}

const OrderListItem = ({ order }: Props) => {
  // Status color mapping
  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: HiClock,
        label: "Payment Pending"
      },
      PLACED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: HiCheckCircle,
        label: "Order Placed"
      },
      CONFIRMED: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: HiCheckCircle,
        label: "Confirmed"
      },
      SHIPPED: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-200",
        icon: HiTruck,
        label: "Shipped"
      },
      DELIVERED: {
        bg: "bg-green-100",
        text: "text-green-900",
        border: "border-green-300",
        icon: HiCheckCircle,
        label: "Delivered"
      },
      CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: HiXCircle,
        label: "Cancelled"
      },
      FAILED: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: HiXCircle,
        label: "Failed"
      }
    };
    return configs[status] || configs.PENDING;
  };

  const getPaymentStatusConfig = (status: PaymentStatus) => {
    const configs = {
      SUCCESS: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Paid"
      },
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Payment Pending"
      },
      FAILED: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Payment Failed"
      },
      REFUNDED: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Refunded"
      }
    };
    return configs[status] || configs.PENDING;
  };

  const formatDate = (date: Date) => {
    return dayjs(date).tz("Asia/Kolkata").format("MMM DD, YYYY");
  };

  const formatTime = (createdAt: Date) => {
    return dayjs(createdAt).tz("Asia/Kolkata").format("hh:mm A");
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.paymentDetails?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden">
      {/* Order Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-600 uppercase mb-0.5">Order Placed</p>
              <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-0.5">Total</p>
              <p className="font-semibold text-gray-900 text-base">
                ₹{order.totalPrice.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-0.5">Ship To</p>
              <p className="font-medium text-gray-900 truncate max-w-[150px]">
                {order.shippingAddress?.fullName || "Customer"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-0.5">Payment Method</p>
              <div className="flex items-center gap-1.5 font-medium text-gray-900">
                {order.paymentDetails?.method === "COD" ? (
                  <>
                    <HiCash className="text-green-600" />
                    <span>Cash on Delivery</span>
                  </>
                ) : (
                  <>
                    <HiCreditCard className="text-blue-600" />
                    <span>Online</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-right">
            <p className="text-xs text-gray-600 uppercase mb-1">Order ID</p>
            <p className="font-mono font-semibold text-gray-900">{order.orderId}</p>
          </div>
        </div>
      </div>

      {/* Order Body */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* Product Images */}
          <div className="flex-shrink-0">
            {order.items.length === 1 ? (
              <img
                src={order.items[0].coverImage || "/placeholder-book.png"}
                alt={order.items[0].title || order.items[0].title}
                className="w-24 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="grid grid-cols-2 gap-2 w-32">
                {order.items.slice(0, 4).map((item, i) => {
                  const remaining = order.items.length - 4;
                  const isLastImage = i === 3 && remaining > 0;

                  return (
                    <div key={i} className="relative aspect-[3/4]">
                      <img
                        src={item.coverImage || "/placeholder-book.png"}
                        alt={item.title || item.title}
                        className={`w-full h-full object-cover rounded border border-gray-200 ${
                          isLastImage ? "opacity-50" : ""
                        }`}
                      />
                      {isLastImage && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                          <span className="text-white text-sm font-bold">+{remaining}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {order.items.length === 1
                    ? order.items[0].title || order.items[0].title
                    : `${order.items.length} items in this order`}
                </h3>

                {order.items.length > 1 && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {order.items
                      .slice(0, 2)
                      .map((item) => item.title || item.title)
                      .join(", ")}
                    {order.items.length > 2 && " & more..."}
                  </p>
                )}

                {/* Quantity info for single item */}
                {order.items.length === 1 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {order.items[0].quantity} × ₹{order.items[0].unitPrice.toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-col gap-2 items-end">
                
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  <StatusIcon className="text-sm" />
                  {statusConfig.label}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.text}`}
                >
                  {paymentConfig.label}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Updated {formatDate(order.updatedAt)}</span>
              </div>

              {order.deliveryDetails?.trackingId && (
                <div className="flex items-center gap-2 text-gray-600">
                  <HiTruck className="text-base" />
                  <span>Tracking: {order.deliveryDetails.trackingId}</span>
                </div>
              )}

              {order.deliveryDetails?.estimatedDeliveryDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Estimated Delivery: {formatDate(order.deliveryDetails.estimatedDeliveryDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/user-dashboard/orders/${order.orderId}`}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                View Details
              </Link>

              {order.deliveryDetails?.trackingId && order.status === "SHIPPED" && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Track Package
                </button>
              )}

              {order.status === "DELIVERED" && (
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Buy Again
                </button>
              )}

              {["PENDING", "PLACED", "CONFIRMED"].includes(order.status) && (
                <Link
                  to={`/user-dashboard/orders/${order.orderId}?action=cancel`}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Cancel Order
                </Link>
              )}

              {order.status === "FAILED" && order.paymentDetails?.status === "FAILED" && (
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                  Retry Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListItem;