import { useFavorite } from "../hooks/use-favorite";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "overlay" | "detail";
  showLabel?: boolean;
  className?: string;
}

export function BookmarkButton({
  movieId,
  variant = "overlay",
  showLabel = false,
  className,
}: BookmarkButtonProps) {
  const { isBookmarked, favoriteQuery, mutation, toggleBookmark } = useFavorite(movieId);

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={toggleBookmark}
      disabled={favoriteQuery.isLoading || mutation.isPending}
      title={favoriteQuery.isError ? "즐겨찾기 조회 실패. 눌러서 다시 시도" : undefined}
      className={cn(
        variant === "detail"
          ? "mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition-colors"
          : "absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors backdrop-blur-sm",
        variant === "detail"
          ? isBookmarked
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
          : isBookmarked
            ? "bg-blue-600/90 text-white"
            : "bg-black/50 text-gray-200 hover:bg-black/70",
        className,
      )}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className={cn(
          "shrink-0",
          variant === "detail" ? "h-4 w-4" : "h-5 w-5",
          (isBookmarked || variant === "overlay") && "brightness-0 invert",
        )}
      />
      {showLabel && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
