import { Home, Users, FileText, Settings, LogOut, UserPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: FileText, label: "Warranties", path: "/warranties" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: UserPlus, label: "Become a Dealer", path: "/become-dealer" },
  ];

  return (
    <div className="h-screen w-64 bg-background border-r border-border p-4 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold px-4">Helmet Hub</h2>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg hover-lift transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto">
          <button className="flex items-center px-4 py-2 w-full text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;