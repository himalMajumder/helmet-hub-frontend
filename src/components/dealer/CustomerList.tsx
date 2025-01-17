import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types/customer";

// Mock data - replace with actual data fetching
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    products: [
      {
        id: "p1",
        name: "Helmet X1",
        model: "Sport",
        warrantyNumber: "W123",
        purchaseDate: "2024-01-15",
      },
    ],
    dealerId: "d1",
    dealerName: "Premium Motors",
  },
  // Add more mock data as needed
];

const CustomerList = () => {
  const { toast } = useToast();
  const [customers] = useState<Customer[]>(mockCustomers);

  const handleView = (customer: Customer) => {
    console.log("Viewing customer:", customer);
    // Implement view logic
  };

  const handleEdit = (customer: Customer) => {
    console.log("Editing customer:", customer);
    // Implement edit logic
  };

  const handleDelete = (customerId: string) => {
    console.log("Deleting customer:", customerId);
    toast({
      title: "Customer deleted",
      description: "The customer has been successfully deleted.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Dealer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{customer.email}</span>
                    <span className="text-sm text-muted-foreground">
                      {customer.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {customer.products.map((product) => (
                      <span
                        key={product.id}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                      >
                        {product.name}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{customer.dealerName}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleView(customer)}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(customer)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(customer.id)}
                        className="cursor-pointer text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerList;