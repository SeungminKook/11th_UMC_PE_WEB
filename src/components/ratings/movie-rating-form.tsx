import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, deleteRating, getMemberRatings, updateRating } from "../../api/ratings/ratings";
import type { Rating, RatingInput } from "../../api/ratings/ratings";

export function MovieRatingForm({ movieId, memberId }: { movieId: number; memberId: number | null }) {
  const queryClient = useQueryClient();
  const queryKey = ["ratings", memberId];
  const ratingsQuery = useQuery({
    queryKey,
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
    retry: false,
  });
  const savedRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);
  const [draft, setDraft] = useState<Partial<RatingInput>>({});
  const score = draft.score ?? savedRating?.score ?? 0;
  const comment = draft.comment ?? savedRating?.comment ?? "";
  const saveMutation = useMutation({
    mutationFn: (body: RatingInput) => savedRating
      ? updateRating(savedRating.ratingId, body)
      : createRating({ movieId, ...body }),
    onMutate: () => queryClient.cancelQueries({ queryKey, exact: true }),
    onSuccess: (rating) => {
      queryClient.setQueryData<Rating[]>(queryKey, (previous = []) =>
        [rating, ...previous.filter((item) => item.movieId !== movieId)]
          .sort((first, second) => second.ratingId - first.ratingId),
      );
      setDraft({});
      alert("평점을 저장했어요.");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onMutate: () => queryClient.cancelQueries({ queryKey, exact: true }),
    onSuccess: () => {
      queryClient.setQueryData<Rating[]>(queryKey, (previous = []) =>
        previous.filter((item) => item.movieId !== movieId),
      );
      setDraft({});
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
  const isPending = saveMutation.isPending || deleteMutation.isPending;

  if (memberId === null) return <Link to="/login" className="mt-3 block text-sm text-indigo-600">로그인 후 평점을 남길 수 있어요.</Link>;
  if (ratingsQuery.isPending) return <p role="status" className="mt-3 text-xs">내 평점을 불러오는 중이에요.</p>;
  if (ratingsQuery.isError) return <button type="button" className="mt-3 text-xs text-red-600" onClick={() => ratingsQuery.refetch()}>평점 조회에 실패했어요. 다시 시도</button>;

  return (
    <form className="mt-3" onSubmit={(event) => {
      event.preventDefault();
      if (score < 1 || score > 5 || comment.length > 500 || isPending) return;
      saveMutation.mutate({ score, comment });
    }}>
      <fieldset disabled={isPending}>
        <legend className="sr-only">별점 선택</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" aria-label={`${star}점`} aria-pressed={score === star}
              onClick={() => setDraft((previous) => ({ ...previous, score: star }))}
              className={`flex h-8 w-8 items-center justify-center rounded-md border text-lg transition-colors ${score >= star ? "border-amber-300 bg-amber-50 text-amber-500" : "border-gray-200 bg-white text-gray-400 hover:bg-gray-100"}`}>
              ★
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="movie-review">영화 후기</label>
        <textarea id="movie-review" value={comment} maxLength={500} rows={3}
          onChange={(event) => setDraft((previous) => ({ ...previous, comment: event.target.value }))}
          placeholder="영화를 보고 느낀 점을 남겨보세요."
          className="mt-2 w-full resize-y rounded-md border border-gray-200 bg-white p-3 text-xs outline-none placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        <button type="submit" disabled={score === 0 || comment.length > 500 || isPending}
          className="mt-1 w-full rounded-md bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300">
          {saveMutation.isPending ? "저장 중" : savedRating ? "평점 수정" : "평점 저장"}
        </button>
        {savedRating && (
          <button type="button" disabled={isPending} onClick={() => deleteMutation.mutate(savedRating.ratingId)}
            className="mt-2 w-full rounded-md border border-red-300 bg-white px-4 py-2 text-xs text-red-600 disabled:opacity-50">
            {deleteMutation.isPending ? "삭제 중" : "평점 삭제"}
          </button>
        )}
      </fieldset>
    </form>
  );
}
