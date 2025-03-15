import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import axiosConfig from "@/lib/axiosConfig";
import { MenuItemType } from "@/lib/types";
import {
    Home,
    Users,
    FileText,
    Settings,
    LogOut,
    UserPlus,
    Plus,
    ShieldCheck,
    MessageSquare,
    UserCircle,
    Shield,
    UserCog,
    FileBox
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { hasPermission } = useAppContext();

    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    const {
        authenticated_token,
        setAuthenticatedUser,
        set_authentication,
        set_authentication_token
    } = useAppContext();


    const menuItems: MenuItemType[] = [
        { icon: Home, label: "Dashboard", path: "/" },
        { icon: ShieldCheck, label: "Check Warranty", path: "/warranty-check" },
        { icon: FileText, label: "Register Warranty", path: "/warranty-registration" },
        { icon: Users, label: "Customers", path: "/customers" },
        { icon: UserCircle, label: "Customer Information", path: "/customer-information" },
        { icon: FileBox, label: "Models", path: "/models" },
        { icon: Plus, label: "Products", path: "/products" },
        {
            icon: Settings,
            label: "Settings",
            path: "/settings",
            subItems: [
                { icon: UserCog, label: "User Management", path: "/users", permission: "Preview User" },
                { icon: Shield, label: "Role Management", path: "/roles", permission: "Preview Role" },
                { icon: MessageSquare, label: "SMS API Integration", path: "/settings/sms-api" }
            ]
        },
        { icon: UserPlus, label: "Become a Dealer", path: "/become-dealer" },
    ];

    const logoutUser = () => {
        axiosConfig({
            method: "post",
            url: "logout",
            headers: {
                Authorization: `Bearer ${authenticated_token}`,
            }
        })
            .then(() => {
                toast({
                    title: "Success",
                    description: "Logged in successfully!",
                });

                set_authentication(false);
                set_authentication_token('');
                setAuthenticatedUser(null);
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    return (
        <div className="h-screen w-64 bg-background border-r border-border p-4 fixed left-0 top-0">
            <div className="flex flex-col h-full">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold px-4">Helmet Hub</h2>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-2">
                        {menuItems.map((item: MenuItemType) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            /**
                             * Check if the user has the permission to access this menu item
                             */
                            if (item.permission !== undefined && !hasPermission(item.permission)) {
                                return null;
                            }

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center px-4 py-2 rounded-lg hover-lift transition-colors ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-secondary"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span>{item.label}</span>
                                    </Link>
                                    {item.subItems && (
                                        <ul className="ml-8 mt-2 space-y-2">
                                            {item.subItems.map((subItem: MenuItemType) => {
                                                const SubIcon = subItem.icon;
                                                const isSubActive = location.pathname === subItem.path;

                                                /**
                                                 * Check if the user has the permission to access this sub menu item
                                                 */
                                                if (subItem.permission !== undefined && !hasPermission(subItem.permission)) {
                                                    return null;
                                                }

                                                return (
                                                    <li key={subItem.path}>
                                                        <Link
                                                            to={subItem.path}
                                                            className={`flex items-center px-4 py-2 rounded-lg hover-lift transition-colors ${isSubActive
                                                                ? "bg-primary text-primary-foreground"
                                                                : "hover:bg-secondary"
                                                                }`}
                                                        >
                                                            <SubIcon className="w-4 h-4 mr-3" />
                                                            <span className="text-sm">{subItem.label}</span>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="mt-auto">
                    <button className="flex items-center px-4 py-2 w-full text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        onClick={logoutUser}>
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;