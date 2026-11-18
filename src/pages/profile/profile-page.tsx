import { FavoriteMovies } from "../../components/profile/favorite-movies";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function ProfilePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">내 정보</h1>
        <Link to="/my-page/edit" className="rounded-lg bg-[#4a60df] px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">정보 수정</Link>
      </div>

      <section className="border-b border-gray-200 py-4">
        <h2 className="mb-4 font-bold">기본 정보</h2>
        <div className="flex flex-wrap items-center gap-6">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gray-200">
            <img src="/icons/person.svg" alt="" className="h-10 w-10" />
          </div>
          <dl className="grid min-w-0 flex-1 gap-4 sm:max-w-3xl sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500">닉네임</dt>
              <dd className="mt-1 text-sm font-semibold">{meQuery.data?.nickname ?? ""}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">이메일</dt>
              <dd className="mt-1 break-all text-sm font-semibold">{meQuery.data?.email ?? ""}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="pt-6">
        <h2 className="mb-4 font-bold">내 즐겨찾기</h2>
        <FavoriteMovies />
      </section>
    </main>
  );
}
