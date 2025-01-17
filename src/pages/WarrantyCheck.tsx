import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

const formSchema = z.object({
  searchValue: z
    .string()
    .min(1, "Please enter a registration number or mobile number"),
});

const WarrantyCheck = () => {
  const { toast } = useToast();
  const [warrantyDetails, setWarrantyDetails] = useState<{
    productName: string;
    dateOfSell: string;
    warrantyNumber: string;
    memoNo: string;
    dealerPoint: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchValue: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // TODO: Replace with actual API call to check warranty
      console.log("Checking warranty for:", values.searchValue);
      
      // Simulated API response
      const mockResponse = {
        productName: "Premium Helmet X1",
        dateOfSell: "2024-02-15",
        warrantyNumber: "WR-2024-001",
        memoNo: "MEM-001",
        dealerPoint: "Central Helmet Store",
      };

      setWarrantyDetails(mockResponse);
      toast({
        title: "Warranty details found",
        description: "Displaying warranty information below.",
      });
    } catch (error) {
      console.error("Error checking warranty:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch warranty details. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Warranty Check</h1>
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="searchValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Registration Number or Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., REG123 or +1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Search className="mr-2" />
              Check Warranty
            </Button>
          </form>
        </Form>

        {warrantyDetails && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Warranty Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Product Name</p>
                <p className="font-medium">{warrantyDetails.productName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Sale</p>
                <p className="font-medium">{warrantyDetails.dateOfSell}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warranty Number</p>
                <p className="font-medium">{warrantyDetails.warrantyNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Memo Number</p>
                <p className="font-medium">{warrantyDetails.memoNo}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Dealer Point</p>
                <p className="font-medium">{warrantyDetails.dealerPoint}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WarrantyCheck;