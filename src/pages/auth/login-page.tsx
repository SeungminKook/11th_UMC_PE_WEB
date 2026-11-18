import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <section className="w-full max-w-[430px]">
        <h1 className="mb-4 text-[32px] font-extrabold tracking-tight">로그인</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-semibold">이메일</label>
            <div className="flex items-center gap-2 rounded-lg border border-[#e1e4ea] bg-white px-3 focus-within:border-[#4a60df]">
              <img src="/icons/mail.svg" alt="" className="h-4 w-4" />
              <input id="login-email" type="email" value={form.email} onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))} autoComplete="username" placeholder="name@example.com" className="h-12 min-w-0 flex-1 text-sm outline-none placeholder:text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-semibold">비밀번호</label>
            <div className="flex items-center gap-2 rounded-lg border border-[#e1e4ea] bg-white px-3 focus-within:border-[#4a60df]">
              <img src="/icons/lock.svg" alt="" className="h-4 w-4" />
              <input id="login-password" type="password" value={form.password} onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))} autoComplete="current-password" placeholder="비밀번호" className="h-12 min-w-0 flex-1 text-sm outline-none placeholder:text-gray-400" />
            </div>
          </div>
          <button type="submit" disabled={!canSubmit || loginMutation.isPending} className="h-12 w-full rounded-lg bg-[#4a60df] text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{loginMutation.isPending ? "로그인 중" : "로그인"}</button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-[#3454e5]">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
