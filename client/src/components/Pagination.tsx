interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg ${
              page === currentPage
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;