import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { HardHat, ShoppingBag, UserCheck, AlertTriangle, Trophy, Users } from "lucide-react";

const Index = () => {
  // Mock data - replace with real data from your backend
  const dailyData = [
    { date: "Mon", sales: 120, warranties: 24 },
    { date: "Tue", sales: 150, warranties: 28 },
    { date: "Wed", sales: 180, warranties: 35 },
    { date: "Thu", sales: 140, warranties: 22 },
    { date: "Fri", sales: 160, warranties: 30 },
  ];

  const topProducts = [
    { name: "Product A", sales: 450 },
    { name: "Product B", sales: 380 },
    { name: "Product C", sales: 320 },
    { name: "Product D", sales: 280 },
    { name: "Product E", sales: 250 },
  ];

  const topDealers = [
    { name: "John's Dealership", sales: 1200, warranties: 240 },
    { name: "Smith Auto", sales: 980, warranties: 196 },
    { name: "Metro Dealers", sales: 850, warranties: 170 },
    { name: "City Motors", sales: 720, warranties: 144 },
  ];

  const newWarrantyCustomers = [
    { name: "Alice Johnson", product: "Product A", date: "2024-03-20", dealer: "John's Dealership" },
    { name: "Bob Smith", product: "Product C", date: "2024-03-19", dealer: "Metro Dealers" },
    { name: "Carol White", product: "Product B", date: "2024-03-18", dealer: "Smith Auto" },
    { name: "David Brown", product: "Product A", date: "2024-03-17", dealer: "City Motors" },
  ];

  const dealerContacts = [
    { dealer: "John's Dealership", phone: "+1234567890", email: "john@dealership.com", lastContact: "2024-03-20" },
    { dealer: "Smith Auto", phone: "+1234567891", email: "smith@auto.com", lastContact: "2024-03-19" },
    { dealer: "Metro Dealers", phone: "+1234567892", email: "metro@dealers.com", lastContact: "2024-03-18" },
    { dealer: "City Motors", phone: "+1234567893", email: "city@motors.com", lastContact: "2024-03-17" },
  ];

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
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
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
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily Report</TabsTrigger>
            <TabsTrigger value="products">Most Selling Products</TabsTrigger>
            <TabsTrigger value="dealers">Top Dealers</TabsTrigger>
            <TabsTrigger value="customers">New Warranty Customers</TabsTrigger>
            <TabsTrigger value="contacts">Dealer Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Daily Performance Report</h2>
              <ChartContainer className="h-[400px]" config={{}}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                  <Line type="monotone" dataKey="warranties" stroke="#82ca9d" />
                </LineChart>
              </ChartContainer>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
              <ChartContainer className="h-[400px]" config={{}}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
            </Card>
          </TabsContent>

          <TabsContent value="dealers" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Top Performing Dealers</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Dealer Name</th>
                      <th className="text-left p-4">Total Sales</th>
                      <th className="text-left p-4">Warranties Issued</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDealers.map((dealer, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{dealer.name}</td>
                        <td className="p-4">${dealer.sales}</td>
                        <td className="p-4">{dealer.warranties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Warranty Registrations</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Customer Name</th>
                      <th className="text-left p-4">Product</th>
                      <th className="text-left p-4">Registration Date</th>
                      <th className="text-left p-4">Dealer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newWarrantyCustomers.map((customer, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{customer.name}</td>
                        <td className="p-4">{customer.product}</td>
                        <td className="p-4">{customer.date}</td>
                        <td className="p-4">{customer.dealer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dealer Contact Information</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Dealer Name</th>
                      <th className="text-left p-4">Phone</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Last Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealerContacts.map((contact, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{contact.dealer}</td>
                        <td className="p-4">{contact.phone}</td>
                        <td className="p-4">{contact.email}</td>
                        <td className="p-4">{contact.lastContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;