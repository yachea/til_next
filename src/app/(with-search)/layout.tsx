import SearchBar from "@/components/SearchBar";
import ServerTest from "@/components/ServerTest";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <SearchBar>
        <ServerTest />
      </SearchBar>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
