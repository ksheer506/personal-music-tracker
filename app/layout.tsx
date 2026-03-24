import type { Metadata } from "next";
import Drawer from "@components/Drawer/Drawer";

import "./globals.css";

export const metadata: Metadata = {
  title: "Music Log v1",
  description: "Flat and interactive personal music analytics dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex flex-col md:flex-row">
        <Drawer />
        <main className="w-full flex-[1_0_0] md:h-dvh p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
