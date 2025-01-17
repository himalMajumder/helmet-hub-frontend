import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CustomerInformation = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Information</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search customers..."
            className="pl-10 w-[300px]"
          />
        </div>
      </div>
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>+1 234 567 890</TableCell>
              <TableCell>2</TableCell>
              <TableCell>
                <Badge variant="success">Active</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View Details</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell>+1 234 567 891</TableCell>
              <TableCell>1</TableCell>
              <TableCell>
                <Badge variant="success">Active</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View Details</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bob Johnson</TableCell>
              <TableCell>bob@example.com</TableCell>
              <TableCell>+1 234 567 892</TableCell>
              <TableCell>3</TableCell>
              <TableCell>
                <Badge variant="warning">Pending</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View Details</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default CustomerInformation;