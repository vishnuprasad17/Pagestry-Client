import React from "react";
import { useDispatch, useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetCartQuery,
  useUpdateCartQtyMutation,
  useRemoveCartItemMutation,
  useValidateCartMutation,
  useClearCartMutation
} from "../../redux/features/cart/cartApi";
import { increaseQty, decreaseQty, removeItem as removeFromCart, clearCart as clearGuestCart } from "../../redux/features/slices/cartSlice";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { AppDispatch, RootState } from "../../redux/store";
import { USER } from "../../constants/nav-routes/userRoutes";

interface Payload {
  bookId: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const guestCart = useSelector((state: RootState) => state.cart.cartItems);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { data: serverCart, isLoading } = useGetCartQuery(user?.mongoUserId ?? "", {
    skip: !user?.mongoUserId,
  });
  const [updateCartQty] = useUpdateCartQtyMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [validateCart] = useValidateCartMutation();
  const [clearCart] = useClearCartMutation();

  const isLoggedIn = Boolean(user?.mongoUserId);
  const cartItems = isLoggedIn ? (serverCart ?? []) : guestCart;

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

  const handleQtyChange = async (bookId: string, qty: number, stock: number) => {
    if (qty > stock) return;
    if (qty < 1) return await removeItem({ userId: user?.mongoUserId!, bookId });
    const res = await updateCartQty({ userId: user?.mongoUserId!, bookId, quantity: qty });
    
    if (!("data" in res) || !res.data?.success) {
      toast.error("Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    if (isLoggedIn) {
      const res = await clearCart(user?.mongoUserId!);
      if ("data" in res && res.data?.success) {
        toast.success("Cart cleared successfully");
      } else {
        toast.error("Failed to clear cart");
      }
    } else {
      dispatch(clearGuestCart());
      toast.success("Cart cleared successfully");
    }
  };

  const handleProceed = async () => {
    const payload: Payload[] = cartItems.map(item => ({
      bookId: item.id,
      quantity: item.quantity
    }));

    const res = await validateCart(payload).unwrap();

    if (res.data?.outOfStock?.length) {
      toast.error("Some items are out of stock");
      return;
    }

    navigate(USER.CHECKOUT);
  };

  if (isLoading) <Loading />

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700 font-medium text-sm px-4 py-2 border border-red-500 rounded hover:bg-red-50 transition"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b py-4 items-center"
            >
              <img
                src={item.coverImage}
                className="w-24 h-24 object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p>₹{item.sellingPrice}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      isLoggedIn ? handleQtyChange(item.id, item.quantity - 1, item.stock)
                      : dispatch(decreaseQty(item.id))
                    }
                  >−</button>

                  <span>{item.quantity}</span>

                  <button
                    disabled={item.quantity === item.stock}
                    className="disabled:opacity-50"
                    onClick={() =>
                      isLoggedIn ? handleQtyChange(item.id, item.quantity + 1, item.stock)
                      : dispatch(increaseQty(item.id))
                    }
                  >+</button>
                </div>
              </div>

              <button
                onClick={() =>
                  isLoggedIn ? removeItem({userId: user?.mongoUserId!, bookId: item.id})
                  : dispatch(removeFromCart(item.id))
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Price Summary */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-700">Delivery Charges</span>
              <span className={`font-medium ${deliveryCharge === 0 ? "text-green-600" : "text-gray-900"}`}>
                {deliveryCharge === 0 ? "FREE DELIVERY" : `₹${deliveryCharge}`}
              </span>
            </div>

            {/* Free delivery message */}
            {deliveryCharge > 0 && amountNeededForFreeDelivery > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  Add ₹{amountNeededForFreeDelivery.toLocaleString("en-IN")} more for FREE delivery
                </p>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t">
              <p className="font-bold text-lg">Total</p>
              <p className="font-bold text-lg">₹{totalPrice.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            { isLoggedIn ?
              <button
              onClick={handleProceed}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Proceed to Checkout
            </button> :
            <Link
              to={USER.LOGIN}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Login to Checkout
            </Link>
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;