import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../api/favorites/favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useAuthStore } from "../../stores/auth-store";
import { getAuthMemberId } from "../../utils/auth-member-id";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import Pagination from "../movies/pagination";

function FavoriteMovie({ movieId }: { movieId: number }) {
  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
  });
  const movie = movieQuery.data;
  const posterUrl = getTmdbPosterUrl(movie?.poster_path ?? null);

  return (
    <li>
      <Link href={`/movies/ + match[1] + `}>
        {posterUrl ? (
          <img src={posterUrl} alt={`${movie?.title} 포스터`} className="aspect-[7/8] w-full rounded-lg object-cover" />
        ) : (
          <div className="flex aspect-[7/8] items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-600">
            {movieQuery.isLoading ? "불러오는 중" : "이미지 없음"}
          </div>
        )}
        <p className="mt-2 text-sm font-semibold">{movie?.title ?? `영화 ${movieId}`}</p>
        <p className="mt-1 text-xs text-gray-500">{movie?.release_date}</p>
      </Link>
      {movieQuery.isError && (
        <button type="button" onClick={() => movieQuery.refetch()} className="mt-1 text-xs text-red-600">
          영화 정보를 불러오지 못했어요. 다시 시도
        </button>
      )}
    </li>
  );
}

export function FavoriteMovies() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getAuthMemberId(accessToken);
  const [page, setPage] = useState(1);
  const favoritesQuery = useQuery({
    queryKey: ["favorites", memberId, "list"],
    queryFn: getFavorites,
    enabled: memberId !== null,
    retry: false,
  });
  const favorites = favoritesQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(favorites.length / 10));
  const currentPage = Math.min(page, totalPages);

  if (memberId === null) return <p>로그인 후 즐겨찾기를 확인할 수 있어요.</p>;
  if (favoritesQuery.isPending) return <p role="status">즐겨찾기를 불러오는 중이에요.</p>;
  if (favoritesQuery.isError) {
    return <button type="button" onClick={() => favoritesQuery.refetch()} className="text-red-600">즐겨찾기 조회에 실패했어요. 다시 시도</button>;
  }
  if (favorites.length === 0) return <p className="text-sm text-gray-500">즐겨찾기한 영화가 없어요.</p>;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {favorites.slice((currentPage - 1) * 10, currentPage * 10).map((favorite) => (
          <FavoriteMovie key={favorite.movieId} movieId={favorite.movieId} />
        ))}
      </ul>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
