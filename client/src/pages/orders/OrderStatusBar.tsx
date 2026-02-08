import { FaCheckCircle, FaTruck, FaBox } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { HiClock, HiXCircle } from "react-icons/hi";
import { OrderStatus } from "../../types/order";
import { IconType } from "react-icons";

interface OrderStatusBarProps {
  currentStatus: OrderStatus;
}

interface Step {
  label: Exclude<OrderStatus, "CANCELLED" | "FAILED">;
  displayLabel: string;
  icon: IconType;
}

const OrderStatusBar = ({ currentStatus }: OrderStatusBarProps) => {
  const isCancelled = currentStatus === "CANCELLED";
  const isFailed = currentStatus === "FAILED";
  const isPending = currentStatus === "PENDING";

  const steps: Step[] = [
    { label: "PENDING", displayLabel: "Payment Pending", icon: HiClock },
    { label: "PLACED", displayLabel: "Order Placed", icon: FaCheckCircle },
    { label: "CONFIRMED", displayLabel: "Confirmed", icon: FaCheckCircle },
    { label: "SHIPPED", displayLabel: "Shipped", icon: FaTruck },
    { label: "DELIVERED", displayLabel: "Delivered", icon: GoPackage },
  ];

  // For PENDING status, only show first step
  const visibleSteps = isPending
    ? steps.filter((s) => s.label === "PENDING")
    : steps.filter((s) => s.label !== "PENDING");

  const activeIndex = visibleSteps.findIndex((step) => step.label === currentStatus);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">Order Status</h3>

      {isCancelled || isFailed ? (
        // Cancelled/Failed Status Display
        <div className="flex flex-col items-center py-8">
          <div
            className={`w-16 h-16 rounded-full ${
              isCancelled
                ? "bg-gradient-to-br from-red-500 to-red-600"
                : "bg-gradient-to-br from-orange-500 to-orange-600"
            } flex items-center justify-center shadow-lg ${
              isCancelled ? "shadow-red-200" : "shadow-orange-200"
            } mb-4`}
          >
            <HiXCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">
            {isCancelled ? "Order Cancelled" : "Order Failed"}
          </p>
          <p className="text-sm text-gray-600 text-center max-w-md">
            {isCancelled
              ? "This order has been cancelled. If you have any questions, please contact our support team."
              : "This order could not be processed. Please try placing a new order or contact support."}
          </p>
          <div className="mt-6 px-6 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              Status: {currentStatus}
            </p>
          </div>
        </div>
      ) : isPending ? (
        // Pending Payment Status
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-200 mb-4 animate-pulse">
            <HiClock className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">Payment Pending</p>
          <p className="text-sm text-gray-600 text-center max-w-md">
            We're waiting for your payment to be completed. Please complete the payment
            to proceed with your order.
          </p>
          <div className="mt-6 px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              Status: PENDING PAYMENT
            </p>
          </div>
        </div>
      ) : (
        // Normal Progress Display
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{
                width: `${
                  activeIndex >= 0
                    ? (activeIndex / (visibleSteps.length - 1)) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {visibleSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeIndex;
              const isCurrent = index === activeIndex;

              return (
                <div key={step.label} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-200"
                        : "bg-gray-200"
                    } ${isCurrent && "ring-4 ring-green-100 scale-110"}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-3 text-sm font-medium text-center ${
                      isActive ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {step.displayLabel}
                  </p>
                  {isCurrent && (
                    <span className="mt-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full font-semibold">
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusBar;