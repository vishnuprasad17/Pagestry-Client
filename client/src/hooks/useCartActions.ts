import { useDispatch } from "react-redux";
import {
  useUpdateCartQtyMutation,
  useRemoveCartItemMutation
} from "../redux/features/cart/cartApi";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem as removeGuestItem
} from "../redux/features/slices/cartSlice";
import toast from "react-hot-toast";
import { AuthUser } from "../redux/features/slices/authSlice";
import { FilteredBook, SingleBook } from "../types/books";
import { mapToCart } from "../utils/mapToCart";
import { AppDispatch } from "../redux/store";
import { WishlistData } from "../types/user";

export const useCartActions = (user: AuthUser | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = Boolean(user?.mongoUserId);

  const [updateQty, { isLoading: updating }] = useUpdateCartQtyMutation();
  const [removeItem, { isLoading: removing }] = useRemoveCartItemMutation();

  const add = async (book: FilteredBook | SingleBook | WishlistData) => {
    if (!isLoggedIn) {
      dispatch(addToCart(mapToCart(book)));
      return;
    }

    const res = await updateQty({
      userId: user!.mongoUserId,
      bookId: book.id,
      quantity: 1
    });

    if (!res?.data?.success) {
      toast.error("Failed to add to cart");
    }
    
  };

  const increase = async (book: FilteredBook | SingleBook, currentQty: number) => {
    if (currentQty >= book.stock) return;

    if (!isLoggedIn) {
      dispatch(increaseQty(book.id));
      return;
    }

    const res = await updateQty({
      userId: user!.mongoUserId,
      bookId: book.id,
      quantity: currentQty + 1
    });

    if (!res?.data?.success) {
      toast.error("Failed to update quantity");
    }
  };

  const decrease = async (book: FilteredBook | SingleBook, currentQty: number) => {
    if (!isLoggedIn) {
      if (currentQty === 1) {
        dispatch(removeGuestItem(book.id));
      } else {
        dispatch(decreaseQty(book.id));
      }
      return;
    }

    if (currentQty === 1) {
      await removeItem({
        userId: user!.mongoUserId,
        bookId: book.id
      });
      return;
    }

    const res = await updateQty({
      userId: user?.mongoUserId!,
      bookId: book.id,
      quantity: currentQty - 1
    });

    if (!res?.data?.success) {
      toast.error("Failed to update quantity");
    }
  };

  return {
    add,
    increase,
    decrease,
    loading: updating || removing
  };
};