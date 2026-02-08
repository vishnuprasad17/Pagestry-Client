import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import cartApi from "../redux/features/cart/cartApi";
import { clearCart } from "../redux/features/slices/cartSlice";
import { AppDispatch, RootState } from "../redux/store";

const CartSync = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const guestCart = useSelector((state: RootState) => state.cart.cartItems);
  const mergedRef = useRef<boolean>(false);

  const userId = user?.mongoUserId;

  useEffect(() => {
    if (!userId || guestCart.length === 0 || mergedRef.current) return;

    mergedRef.current = true;

    dispatch(
      cartApi.endpoints.mergeCart.initiate({
        userId,
        items: guestCart.map(item => ({
          bookId: item.id,
          quantity: item.quantity,
        })),
      })
    )
      .unwrap()
      .then(() => {
        dispatch(clearCart());
      })
      .catch(() => {
        mergedRef.current = false;
      });
  }, [user, userId, guestCart, dispatch]);

  return null;
};

export default CartSync;