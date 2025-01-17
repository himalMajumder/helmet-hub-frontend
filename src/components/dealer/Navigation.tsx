import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const links = [
    {
      href: "/products/add",
      label: "Add Product",
      icon: Plus,
    },
    {
      href: "/warranty-check",
      label: "Check Warranty",
      icon: ShieldCheck,
    },
  ];

  return (
    <nav className="flex gap-4 mb-8">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.href} to={link.href}>
            <Button
              variant={location.pathname === link.href ? "default" : "outline"}
              className={cn(
                "gap-2",
                location.pathname === link.href
                  ? ""
                  : "hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;