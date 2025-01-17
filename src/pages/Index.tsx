import { Card } from "@/components/ui/card";
import CustomerForm from "@/components/dealer/CustomerForm";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Helmet, ShoppingBag, UserCheck, AlertTriangle } from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "2,345",
      icon: ShoppingBag,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Active Warranties",
      value: "1,876",
      icon: Helmet,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Customers",
      value: "946",
      icon: UserCheck,
      trend: "+15.3%",
      trendUp: true,
    },
    {
      title: "Pending Claims",
      value: "7",
      icon: AlertTriangle,
      trend: "-2.5%",
      trendUp: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              
              return (
                <Card key={index} className="p-6 hover-lift glass-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                      <p
                        className={`text-sm mt-1 ${
                          stat.trendUp ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.trend}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="fade-in">
            <CustomerForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;