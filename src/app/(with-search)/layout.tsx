import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import { Suspense } from "react";

// SEO 적용
export const metadata: Metadata = {
  title: "상품 홍보 페이지",
  description: "상품 홍보 페이지입니다.",
  openGraph: {
    title: "상품 홍보 페이지",
    description: "상품 홍보 페이지입니다.",
    images: [{ url: "/thumbnail.png" }],
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBar />
      </Suspense>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
