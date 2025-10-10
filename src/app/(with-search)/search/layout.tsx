import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div>여기는 검색 레이아웃입니다.</div>
      {children}
    </div>
  );
}

export default Layout;
