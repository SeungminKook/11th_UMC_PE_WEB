import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) {
          setMovies(response.results);
          setCurrentPage(1);
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  const pageSize = 10;
  const totalPages = Math.ceil(movies.length / pageSize);
  const visibleMovies = movies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <main className="mx-auto min-h-[calc(100vh-73px)] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-7 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
        영화 목록
      </h1>
      {isLoading ? (
        <p role="status" className="py-12 text-center text-gray-500">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p role="alert" className="py-12 text-center text-red-600">
          {errorMessage}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={visibleMovies} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </main>
  );
}

