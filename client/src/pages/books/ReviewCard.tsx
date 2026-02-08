import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PaginatedReviewData } from "../../types/review";
dayjs.extend(relativeTime);

type Props = {
  isLoggedin: boolean;
  review: PaginatedReviewData;
  onLike: () => void;
  onDislike: () => void;
};

const ReviewCard = ({ isLoggedin,review, onLike, onDislike }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      
      {/* LINE 1 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaStar className="text-yellow-400" />
          <span className="font-semibold">{review.rating}</span>
          <span className="font-medium">{review.title}</span>
        </div>

        <span className="text-sm text-gray-500">
          {dayjs(review.createdAt).fromNow()}
        </span>
      </div>

      {/* LINE 2 */}
      <p className="text-gray-700 mt-2">{review.content}</p>

      {/* LINE 3 */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-600">
          — {review.userName}
        </span>

        <div className="flex gap-4">
          <button onClick={onLike} disabled={!isLoggedin} className="flex items-center gap-1">
            <FaThumbsUp /> {review.likes}
          </button>
          <button onClick={onDislike} disabled={!isLoggedin} className="flex items-center gap-1">
            <FaThumbsDown /> {review.dislikes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;