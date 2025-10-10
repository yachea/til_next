import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      제품소개
      {children}
    </div>
  );
}

export default Layout;
