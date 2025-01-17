import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  productName: string;
  model: string;
  modelNumber: string;
  type: string;
  size: string;
  colors: string[];
  price?: string;
}

const ProductList = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product);
    toast({
      title: "Edit Product",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleView = (product: Product) => {
    console.log("Viewing product:", product);
    toast({
      title: "View Product",
      description: `Viewing details for ${product.productName}`,
    });
  };

  const handleDelete = (product: Product) => {
    console.log("Deleting product:", product);
    setProducts(products.filter((p) => p.id !== product.id));
    toast({
      title: "Product Deleted",
      description: `${product.productName} has been deleted.`,
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Product List</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Colors</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.model}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>{product.size}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;