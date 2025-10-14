import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";

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
