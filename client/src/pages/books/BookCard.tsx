import { FaStar, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCartActions } from "../../hooks/useCartActions";
import { FilteredBook } from "../../types/books";
import { CartData } from "../../types/cart";
import { AuthUser } from "../../redux/features/slices/authSlice";

interface BookCardProps {
  book: FilteredBook;
  cartItems: CartData[]
  user: AuthUser | null;
}

const BookCard = ({ book, cartItems, user }: BookCardProps) => {
  const cartItem = cartItems.find(i => i.id === book.id);
  const qty = cartItem?.quantity || 0;

  const { add, increase, decrease, loading } = useCartActions(user);

  return (
    <div className="bg-white rounded-xl shadow border flex flex-col overflow-hidden">

      <Link to={`/books/${book.id}`} className="bg-gray-100 p-4">
        <img
          src={book.coverImage}
          className="w-full h-48 object-contain"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm truncate">{book.title}</h3>

        <div className="flex items-center gap-1 mt-1 mb-2">
          <span className="text-sm font-semibold">{book.averageRating.toFixed(1)}</span>
          <FaStar size={12} />
          <span className="text-xs text-gray-400">
            {book.ratingCount}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <p className="font-bold text-lg">₹{book.sellingPrice}</p>
            <span className="text-xs text-gray-500 line-through">₹{book.mrp}</span>
            <span className="text-xs text-green-600 font-semibold">
              {book.discountPercentage}% off
            </span>
          </div>
        </div>

        {/* CART UI */}
        {book.stock === 0 ? (
          <button className="bg-gray-400 text-white py-2 rounded mt-auto">
            Out of Stock
          </button>
        ) : qty === 0 ? (
          <button
            onClick={() => add(book)}
            className="bg-black text-white py-2 rounded mt-auto"
            disabled={loading}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between mt-auto border rounded">
            <button
              onClick={() => decrease(book, qty)}
              disabled={loading}
              className="px-3 py-1"
            >
              {qty === 1 ? <FaTrash /> : "−"}
            </button>

            <span className="font-semibold">{qty}</span>

            <button
              onClick={() => increase(book, qty)}
              disabled={qty >= book.stock || loading}
              className="px-3 py-1 disabled:opacity-50"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;