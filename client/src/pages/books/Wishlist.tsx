import React, { useState } from "react";
import {
  useFetchWishListQuery,
  useRemoveFromWishListMutation,
} from "../../redux/features/user/userApi";
import { useGetCartQuery } from "../../redux/features/cart/cartApi";
import { useSelector } from "react-redux";
import WishListSkeleton from "../../components/WishListSkeleton";
import WishlistCard from "./WishlistCard";
import { RootState } from "../../redux/store";

const Wishlist: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { data: wishlist = [], isLoading } = useFetchWishListQuery(
    user?.mongoUserId!,
    {
      skip: !user?.mongoUserId,
    }
  );

  const { data: serverCart = [] } = useGetCartQuery(user?.mongoUserId ?? "", {
    skip: !user?.mongoUserId
  });

  const [removeFromWishlist] = useRemoveFromWishListMutation();

  const handleRemove = async (bookId: string): Promise<void> => {
    try {
      setRemovingId(bookId);
      const data = await removeFromWishlist({
        userId: user?.mongoUserId!,
        bookId,
      }).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  /* ---------------- Skeleton Loader ---------------- */
  if (isLoading) return <WishListSkeleton />;

  if (!wishlist.length) {
    return (
      <div className="text-center mt-20 text-gray-500">
        <h2 className="text-xl font-semibold">Your wishlist is empty ❤️</h2>
        <p className="mt-2">Add books you love to see them here</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          My Wishlist
          <span className="ml-2 text-sm text-gray-500">
            ({wishlist.length} items)
          </span>
        </h1>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {wishlist.map((book) => (
          <WishlistCard
            key={book.id}
            book={book}
            cartItems={serverCart}
            user={user}
            isRemoving={removingId === book.id}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;