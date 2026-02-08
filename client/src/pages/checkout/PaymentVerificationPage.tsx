import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useVerifyPaymentMutation } from "../../redux/features/orders/orderApi";
import { clearCheckoutAddress } from "../../redux/features/slices/checkoutSlice";
import toast from "react-hot-toast";
import { HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";
import { AppDispatch } from "../../redux/store";
import { PaymentData } from "../../types/order";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { USER } from "../../constants/nav-routes/userRoutes";

const PaymentVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const paymentData: PaymentData = location.state;

        if (!paymentData || !paymentData.orderId) {
          toast.error("Invalid payment data");
          navigate("/orders");
          return;
        }

        const result = await verifyPayment({
          orderId: paymentData.orderId,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        }).unwrap();

        if (result.success) {
          setStatus("success");
          dispatch(clearCheckoutAddress());
          toast.success(result.message || "Payment verified successfully!");
          
          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            navigate(USER.ORDERS);
          }, 3000);
        } else {
          setStatus("failed");
          toast.error(result.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        toast.error(getApiErrorMessage(error, "Payment verification failed"));
      }
    };

    verifyPaymentStatus();
  }, [location, verifyPayment, navigate, dispatch]);

  const handleViewOrders = () => {
    navigate(USER.ORDERS);
  };

  const handleRetry = () => {
    navigate(USER.CHECKOUT);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Verifying Status */}
        {status === "verifying" && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <HiClock className="text-6xl text-yellow-500 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Success Status */}
        {status === "success" && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <HiCheckCircle className="text-6xl text-green-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            <button
              onClick={handleViewOrders}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              View My Orders
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to orders page in 3 seconds...
            </p>
          </div>
        )}

        {/* Failed Status */}
        {status === "failed" && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <HiXCircle className="text-6xl text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please try again or contact support if the amount was deducted.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleViewOrders}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                View My Orders
              </button>
              <button
                onClick={handleRetry}
                className="w-full bg-white text-black py-3 rounded-md border-2 border-black hover:bg-gray-50 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;