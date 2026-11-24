"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "../stores/auth-store";
import { restoreBookmarks } from "../stores/bookmark-store";

const ONE_MINUTE = 60 * 1000;

export const AuthReadyContext = createContext(false);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: ONE_MINUTE },
    },
  }));
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    Promise.resolve(useAuthStore.persist?.rehydrate()).then(
      () => setAuthReady(true),
      () => setAuthReady(true),
    );
    restoreBookmarks();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthReadyContext.Provider value={authReady}>
        {children}
      </AuthReadyContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
