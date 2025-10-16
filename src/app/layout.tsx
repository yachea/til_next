import React from "react";
import "./globals.css";
import styles from "@/app/layout.module.css";
import Link from "next/link";
import { Metadata } from "next";

// SEO 설정
export const metadata: Metadata = {
  title: "내가 만드는 쇼핑몰",
  description: "쇼핑몰 만드는 것에 대한 소개글 입니다.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}
function Rootlayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>
        <div className={styles.container}>
          <header>
            <Link href={"/"}>👕 Shopping Mall 👔</Link>
          </header>
          <main>{children}</main>
          <footer>하단</footer>
        </div>
      </body>
    </html>
  );
}

export default Rootlayout;
