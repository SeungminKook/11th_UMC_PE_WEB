import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: "umcine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-[#f5f6f8]">
            <Header />
            <div className="flex flex-1 flex-col">
              {children}
            </div>
            <footer className="border-t border-gray-200 bg-white">
              <div className="mx-auto flex min-h-12 max-w-6xl items-center justify-end gap-2 px-4 text-[10px] text-gray-500 sm:px-6 sm:text-xs">
                <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-3 w-auto" />
                <span>
                  This product uses the TMDB API but is not endorsed or certified by TMDB.
                </span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
