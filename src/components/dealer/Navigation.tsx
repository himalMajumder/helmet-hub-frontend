import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const links = [
    { href: "/customers", label: "Warranty Registration" },
    { href: "/products/add", label: "Add Product" },
  ];

  return (
    <nav className="flex space-x-4 mb-6">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={cn(
            "px-4 py-2 rounded-lg transition-colors",
            location.pathname === link.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;