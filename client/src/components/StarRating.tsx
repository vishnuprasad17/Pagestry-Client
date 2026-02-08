import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onChange: (value: number) => void;
  readonly?: boolean;
}

const StarRating = ({ rating, onChange, readonly = false }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          className={`transition-all ${!readonly && 'hover:scale-110'}`}
          disabled={readonly}
        >
          <FaStar
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;