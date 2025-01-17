import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import ProductList from "./ProductList";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  modelNumber: z.string().min(1, "Model number is required"),
  type: z.string().min(1, "Type is required"),
  size: z.string().min(1, "Size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  price: z.string().optional(),
});

const AddProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    // Check for authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to add products.",
        });
        navigate("/login");
      }
      setSession(session);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      model: "",
      modelNumber: "",
      type: "",
      size: "",
      colors: [],
      price: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to add products.",
        });
        navigate("/login");
        return;
      }

      console.log("Form submitted:", values);
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: values.productName,
          model: values.model,
          model_number: values.modelNumber,
          type: values.type,
          size: values.size,
          price: values.price ? parseFloat(values.price) : null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting product:", error);
        let errorMessage = "Failed to add product. ";
        
        if (error.code === "42501") {
          errorMessage += "You don't have permission to add products.";
        } else {
          errorMessage += "Please try again.";
        }
        
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        return;
      }

      console.log("Product inserted successfully:", data);
      
      toast({
        title: "Product added successfully",
        description: `${values.productName} has been added to the catalog.`,
      });
      form.reset();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product. Please try again.",
      });
    }
  };

  // ... keep existing code (form JSX)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="modelNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-face">Full Face</SelectItem>
                      <SelectItem value="open-face">Open Face</SelectItem>
                      <SelectItem value="half-face">Half Face</SelectItem>
                      <SelectItem value="flip-up">Flip-up</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                      <SelectItem value="free">Free Size</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <FormControl>
                    <Input
                      type="color"
                      onChange={(e) => {
                        const newColor = e.target.value;
                        if (!field.value.includes(newColor)) {
                          field.onChange([...field.value, newColor]);
                        }
                      }}
                    />
                  </FormControl>
                  <div className="flex gap-2 mt-2">
                    {field.value.map((color, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <div
                          className="w-6 h-6 rounded-full cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            field.onChange(field.value.filter((_, i) => i !== index));
                          }}
                        />
                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => form.reset()}>
              Clear
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </Form>

      <ProductList />
    </div>
  );
};

export default AddProduct;
