import React from "react";
import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";
import { WishlistData } from "../../types/user";
import { CartData } from "../../types/cart";
import { useCartActions } from "../../hooks/useCartActions";
import { AuthUser } from "../../redux/features/slices/authSlice";

interface WishlistCardProps {
  book: WishlistData;
  cartItems: CartData[];
  user: AuthUser | null;
  isRemoving: boolean;
  onRemove: (bookId: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  book,
  cartItems,
  user,
  isRemoving,
  onRemove,
}) => {
  const cartItem = cartItems.find((i) => i.id === book.id);
  const qty = cartItem?.quantity || 0;

  const { add, loading } = useCartActions(user);

  return (
    <div
      className={`relative flex gap-4 p-3 bg-white border rounded-xl transition-all duration-300
        hover:bg-gray-50 hover:shadow-md
        ${isRemoving ? "opacity-0 translate-x-10" : "opacity-100"}`}
    >
      {/* IMAGE */}
      <Link to={`/books/${book.id}`}>
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
        />
      </Link>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <Link to={`/books/${book.id}`}>
            <h3 className="text-sm font-medium line-clamp-2">{book.title}</h3>
          </Link>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-base font-semibold text-green-600">
              ₹{book.sellingPrice}
            </span>
            <span className="text-sm line-through text-gray-400">
              ₹{book.mrp}
            </span>
          </div>
        </div>

        {/* ACTION */}
        {book.stock > 0 ? (
          qty > 0 ? (
            <Link
              to="/cart"
              className="mt-3 w-fit flex items-center gap-2 text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition"
            >
              <FaShoppingBag size={12} /> Go to Cart
            </Link>
          ) : (
            <button
              onClick={() => add(book)}
              disabled={loading}
              className="mt-3 w-fit flex items-center gap-2 text-xs border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingBag size={12} /> {loading ? "Adding..." : "Move to Cart"}
            </button>
          )
        ) : (
          <div className="mb-10 text-xs font-semibold uppercase text-red-500">
            Out of stock
          </div>
        )}
      </div>

      {/* DELETE ICON */}
      <button
        onClick={() => onRemove(book.id)}
        className="absolute top-2 right-2 text-[11px] text-gray-400 hover:text-red-500"
        title="Remove"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default WishlistCard;