import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;