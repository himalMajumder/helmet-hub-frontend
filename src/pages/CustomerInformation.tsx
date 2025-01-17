import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - replace with actual data from your backend
const customers = [
  {
    id: 1,
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john@example.com",
    products: [
      {
        name: "Full Face Helmet X1",
        purchaseDate: "2024-01-15",
        registrationExpiry: "2025-01-15",
        serialNumber: "HLM001",
        purchaseDealer: "Helmet Hub Delhi",
        activationDealer: "Helmet Hub Delhi",
      },
    ],
    address: "123 Main St, Delhi",
    registrationDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane@example.com",
    products: [
      {
        name: "Half Face Helmet H3",
        purchaseDate: "2024-02-01",
        registrationExpiry: "2025-02-01",
        serialNumber: "HLM002",
        purchaseDealer: "Helmet Hub Mumbai",
        activationDealer: "Helmet Hub Mumbai",
      },
      {
        name: "Full Face Helmet X2",
        purchaseDate: "2024-02-15",
        registrationExpiry: "2025-02-15",
        serialNumber: "HLM003",
        purchaseDealer: "Helmet Hub Mumbai",
        activationDealer: "Helmet Hub Mumbai",
      },
    ],
    address: "456 Park Ave, Mumbai",
    registrationDate: "2024-02-01",
  },
];

const CustomerInformation = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6 mt-16">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Customer Information</h1>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {customer.name}
                    <span className="text-sm font-normal text-muted-foreground ml-4">
                      Registered on {customer.registrationDate}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Information</p>
                      <p>Phone: {customer.phone}</p>
                      <p>Email: {customer.email}</p>
                      <p>Address: {customer.address}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Purchased Products</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Serial Number</TableHead>
                          <TableHead>Purchase Date</TableHead>
                          <TableHead>Registration Expiry</TableHead>
                          <TableHead>Purchase Dealer</TableHead>
                          <TableHead>Activation Dealer</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.serialNumber}</TableCell>
                            <TableCell>{product.purchaseDate}</TableCell>
                            <TableCell>{product.registrationExpiry}</TableCell>
                            <TableCell>{product.purchaseDealer}</TableCell>
                            <TableCell>{product.activationDealer}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerInformation;