interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="영화 목록 페이지" className="mt-10 flex justify-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={currentPage === page ? "page" : undefined}
          className={`h-9 w-9 rounded-lg border text-sm font-semibold transition-colors ${
            currentPage === page
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
