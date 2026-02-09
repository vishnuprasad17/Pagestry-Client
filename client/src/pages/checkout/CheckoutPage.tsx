import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  useGetCartQuery,
  useValidateCartMutation,
} from "../../redux/features/cart/cartApi";
import { useFetchAddressesQuery } from "../../redux/features/address/addressApi";
import { 
  useCreateOrderMutation,
  useGetRazorpayConfigQuery 
} from "../../redux/features/orders/orderApi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCheckoutAddress } from "../../redux/features/slices/checkoutSlice";
import { HiLocationMarker, HiPencil, HiCreditCard, HiCash } from "react-icons/hi";
import { RootState } from "../../redux/store";
import { OrderData, PaymentMethod, RazorpayPaymentResponse } from "../../types/order";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { USER } from "../../constants/nav-routes/userRoutes";

const Checkout: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const selectedAddressId = useSelector((state: RootState) => state.checkout.selectedAddressId);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("RAZORPAY");

  const { data: addresses = [], isLoading: isFetching } = useFetchAddressesQuery(user?.mongoUserId as string, {
    skip: !user?.mongoUserId,
  });

  const { data: razorpayConfig } = useGetRazorpayConfigQuery();

  const defaultAddress = addresses.find(addr => addr.isDefault);
  const deliveryAddress = addresses.find(addr => addr.id === selectedAddressId) || defaultAddress;

  const dispatch = useDispatch();

  const { data: cartItems = [], refetch } = useGetCartQuery(user?.mongoUserId as string, {
    skip: !user?.mongoUserId,
  });

  const [validateCart] = useValidateCartMutation();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );

  // Delivery charge logic
  const FREE_DELIVERY_THRESHOLD = 600;
  const DELIVERY_CHARGE = 49;
  const deliveryCharge = subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0;
  const totalPrice = subtotal + deliveryCharge;
  const amountNeededForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  const handleRazorpayPayment = async (order: OrderData, razorpayOrderId: string) => {
    if (!razorpayConfig?.keyId) {
      toast.error("Payment configuration not loaded");
      return;
    }

    const options = {
      key: razorpayConfig.keyId,
      amount: order.totalPrice * 100,
      currency: "INR",
      name: "Pagestry",
      description: `Order ${order.orderId}`,
      order_id: razorpayOrderId,
      handler: async function (response: RazorpayPaymentResponse) {
        try {
          // Navigate to payment verification page
          navigate(USER.VERIFY_PAYMENT, {
            state: {
              orderId: order.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          });
        } catch (error) {
          console.error(error);
          toast.error("Payment verification failed");
          navigate(USER.ORDERS);
        }
      },
      prefill: {
        name: deliveryAddress?.fullName,
        email: user?.email,
        contact: deliveryAddress?.phone,
      },
      notes: {
        address: deliveryAddress?.addressLine1,
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function() {
          toast.error("Payment cancelled");
          navigate(USER.ORDERS);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const onSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!deliveryAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const payload = cartItems.map((item) => ({
      bookId: item.id,
      quantity: item.quantity,
      unitPrice: item.sellingPrice,
    }));

    // Validate cart
    const validation = await validateCart(payload).unwrap();
    if (!validation.success) {
      toast.error("Stock changed. Please review cart.");
      refetch();
      return;
    }

    try {
      const res = await createOrder({
        idempotencyKey: uuid(),
        userId: user?.mongoUserId!,
        email: user?.email!,
        addressId: deliveryAddress.id,
        items: payload,
        subtotal,
        deliveryCharge,
        totalPrice,
        paymentMethod
      }).unwrap();

      if (!res?.success) {
        console.log(res);
        toast.error(res?.message || "Order creation failed");
        return;
      }

      // Handle payment based on method
      if (paymentMethod === "COD") {
        dispatch(clearCheckoutAddress());
        toast.success("Order placed successfully!");
        navigate(USER.ORDERS);
      } else if (paymentMethod === "RAZORPAY") {
        // Open Razorpay checkout
        await handleRazorpayPayment(res.data.order, res.data.razorpayOrderId);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(getApiErrorMessage(error, "Failed to create order"));
      refetch();
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* LEFT SECTION */}
      <div className="lg:col-span-2 space-y-6">
        {/* Delivery Address Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <HiLocationMarker className="text-gray-600" />
              Delivery Address
            </h2>
            {deliveryAddress && (
              <button
                type="button"
                onClick={() => navigate(USER.CHECKOUT_ADDRESS)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <HiPencil className="w-4 h-4" />
                Change
              </button>
            )}
          </div>

          {deliveryAddress ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{deliveryAddress.fullName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {deliveryAddress.addressLine1}
                    {deliveryAddress.addressLine2 && `, ${deliveryAddress.addressLine2}`}
                  </p>
                  {deliveryAddress.landmark && (
                    <p className="text-sm text-gray-600">
                      Landmark: {deliveryAddress.landmark}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {deliveryAddress.country}
                  </p>
                  <p className="text-sm text-gray-900 font-medium mt-2">
                    Phone: {deliveryAddress.phone}
                  </p>
                </div>
                {deliveryAddress.isDefault && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No delivery address selected</p>
              <button
                type="button"
                onClick={() => navigate(USER.CHECKOUT_ADDRESS)}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Add New Address
              </button>
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Payment Method
          </h2>

          <div className="space-y-3">
            {/* Razorpay Option */}
            <label
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "RAZORPAY"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="RAZORPAY"
                checked={paymentMethod === "RAZORPAY"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-4 h-4 text-black focus:ring-black"
              />
              <HiCreditCard className="ml-3 text-2xl text-gray-600" />
              <div className="ml-3">
                <p className="font-medium text-gray-900">Credit/Debit Card, UPI, Netbanking</p>
                <p className="text-sm text-gray-500">Pay securely using Razorpay</p>
              </div>
            </label>

            {/* COD Option */}
            <label
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "COD"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-4 h-4 text-black focus:ring-black"
              />
              <HiCash className="ml-3 text-2xl text-gray-600" />
              <div className="ml-3">
                <p className="font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when you receive the order</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white p-6 rounded-lg shadow sticky top-6 h-fit">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          Order Summary
        </h2>

        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                ₹{(item.sellingPrice * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>

        {cartItems.length === 0 && (
          <p className="text-center text-gray-500 py-4">Your cart is empty</p>
        )}

        <hr className="my-4" />

        {/* Subtotal and Delivery Charges */}
        {cartItems.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Delivery Charges</span>
              <span className={`font-medium ${deliveryCharge === 0 ? "text-green-600" : "text-gray-900"}`}>
                {deliveryCharge === 0 ? "FREE DELIVERY" : `₹${deliveryCharge}`}
              </span>
            </div>
            
            {/* Free delivery message */}
            {deliveryCharge > 0 && amountNeededForFreeDelivery > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-2">
                <p className="text-xs text-blue-800">
                  Add ₹{amountNeededForFreeDelivery.toLocaleString("en-IN")} more for FREE delivery
                </p>
              </div>
            )}
          </div>
        )}

        <hr className="my-4" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{totalPrice.toLocaleString("en-IN")}</span>
        </div>

        <button
          type="submit"
          disabled={!deliveryAddress || isLoading || cartItems.length < 1}
          className="mt-6 w-full bg-black text-white py-3 rounded-md
          hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors font-medium"
        >
          {isLoading 
            ? "Processing..." 
            : paymentMethod === "COD" 
              ? "Place Order" 
              : "Proceed to Payment"
          }
        </button>

        {!deliveryAddress && cartItems.length > 0 && (
          <Link to = {USER.CHECKOUT_ADDRESS}>
          <p className="text-xs text-red-600 text-center mt-2">
            Please select a delivery address
          </p>
          </Link>
        )}
      </div>
    </form>
  );
};

export default Checkout;