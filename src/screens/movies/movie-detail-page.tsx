"use client";

import { MovieRatingForm } from "../../components/ratings/movie-rating-form";
import { useAuthStore } from "../../stores/auth-store";
import { getAuthMemberId } from "../../utils/auth-member-id";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage({ movieIdParam }: { movieIdParam: string }) {
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getAuthMemberId(accessToken);

  if (!isValidMovieId) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-128px)] w-full max-w-6xl flex-1 items-start px-4 py-12 sm:px-6">
        <p
          role="alert"
          className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-gray-700"
        >
          올바르지 않은 영화 번호예요.
        </p>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-128px)] w-full max-w-6xl flex-1 items-start px-4 py-12 sm:px-6">
        <p
          role="status"
          className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-gray-700"
        >
          영화 상세 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-128px)] w-full max-w-6xl flex-1 items-start px-4 py-12 sm:px-6">
        <p
          role="alert"
          className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-gray-700"
        >
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </p>
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");

  const runtime =
    typeof movie.runtime === "number"
      ? movie.runtime >= 60
        ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
        : `${movie.runtime}분`
      : "상영 시간 정보가 없어요.";

  return (
    <main className="flex-1 text-gray-900">
      <section className="relative isolate flex min-h-[270px] overflow-hidden bg-gray-950 text-white sm:min-h-[310px]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gray-500 text-sm text-white">
            이미지 없음
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/35"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/20"
        />

        <div className="mx-auto flex w-full max-w-6xl flex-col justify-end px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href="/"
            className="mb-auto inline-flex w-fit items-center gap-2 rounded-full px-1 py-1 text-xs font-medium text-white/90 transition hover:text-white"
          >
            <span aria-hidden="true">←</span> 영화 목록
          </Link>

          <div className="max-w-3xl pt-12 sm:pt-16">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {movie.title}
            </h1>

            <p className="mt-1 text-xs text-gray-200 sm:text-sm">
              {movie.original_title}
            </p>

            <p className="mt-2 text-[11px] font-medium text-gray-100 sm:text-xs">
              {movie.release_date} · {genreNames} · {runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-[360px] bg-[#f5f6f8]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-7 px-4 py-6 sm:px-6 md:grid-cols-[140px_minmax(0,1fr)_260px] md:gap-6 lg:gap-8">
          <div className="mx-auto aspect-[2/3] w-36 self-start overflow-hidden rounded-lg bg-gray-200 shadow-xl md:mx-0 md:w-full">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} 포스터`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-600">
                이미지 없음
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900">
              {movie.tagline}
            </h2>

            <p className="mt-3 text-xs leading-6 text-gray-600 sm:text-sm">
              {movie.overview}
            </p>

            <BookmarkButton movieId={movie.id} variant="detail" showLabel />
          </div>

          <aside className="border-t border-gray-200 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <h2 className="text-sm font-bold text-gray-900">내 평점</h2>

            <p className="mt-1 text-[10px] text-gray-400">
              별점을 주고, 후기는 선택이에요.
            </p>

            <MovieRatingForm
              key={movieId + ":" + memberId}
              movieId={movieId}
              memberId={memberId}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
