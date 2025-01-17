import CustomerForm from "@/components/dealer/CustomerForm";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Navigation from "@/components/dealer/Navigation";
import { HardHat, ShoppingBag, UserCheck, AlertTriangle } from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "$45,231",
      icon: ShoppingBag,
      trend: "+20.1%",
      trendUp: true,
    },
    {
      title: "Active Warranties",
      value: "1,876",
      icon: HardHat,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Registered Customers",
      value: "2,317",
      icon: UserCheck,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Warranty Claims",
      value: "24",
      icon: AlertTriangle,
      trend: "-2.4%",
      trendUp: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6 mt-16">
          <Navigation />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-card rounded-xl border border-border hover-lift"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg ${
                        stat.title === "Warranty Claims"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        stat.trendUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.title}</p>
                </div>
              );
            })}
          </div>
          <CustomerForm />
        </main>
      </div>
    </div>
  );
};

export default Index;