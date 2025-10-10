interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div>검색창</div>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
