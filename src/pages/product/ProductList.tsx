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
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ProductType } from "@/lib/types";

// Fetch function for react-query
const fetchProducts = async (authenticated_token: string) => {
    try {
        const response = await axiosConfig({
            method: "get",
            url: "/products",
            headers: {
                Authorization: `Bearer ${authenticated_token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        return response.data.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch products");
    }

};

const ProductList = () => {
    const navigate = useNavigate();
    const { authenticated_token } = useAppContext();
    const { toast } = useToast();
    const queryClient = useQueryClient();


    /**
     * Query to fetch products
     */
    const { data: products = [], error, isError, refetch } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return fetchProducts(authenticated_token);
        },
        enabled: !!authenticated_token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    /**
     * Error handling
     */
    useEffect(() => {
        if (isError) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            console.error("Query error:", errorMessage);

            toast({
                title: "Error",
                description: errorMessage,
            });
        }
    }, [isError, error, toast]);

    /**
     * Mutation to delete a product
     */
    const deleteProductMutation = useMutation({
        mutationKey: ["deleteProduct"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "delete",
                url: `/products/${uuid}`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to delete product");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Bike model deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    /**
     * Handle delete
     * @param uuid 
     */
    const handleDelete = async (uuid: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteProductMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };

    /**
     * Mutation to inactive a product
     */
    const inactiveProductMutation = useMutation({
        mutationKey: ["suspendProduct"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "put",
                url: `/products/${uuid}/suspend`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to inactive product");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Bike model inactive successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    /**
     * Handle inactive
     * @param uuid 
     */
    const handleInactive = async (uuid: string) => {
        if (window.confirm("Are you sure you want to inactive this product?")) {
            inactiveProductMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };

    /**
     * Mutation to active a product
     */
    const activeProductMutation = useMutation({
        mutationKey: ["activateProduct"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "put",
                url: `/products/${uuid}/activate`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to activate product");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Bike model activate successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    /**
    * Handle active
    * @param uuid 
    */
    const handleActive = async (uuid: string) => {
        if (window.confirm("Are you sure you want to inactive this product?")) {
            activeProductMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };

    return (
        <>
            <div className="flex justify-end space-x-4 p-5">
                <Button type="button" onClick={() => navigate("/products/create")} variant="default">Create Product</Button>
                <Button type="button" onClick={() => navigate("/products/import")} variant="default">Import Products</Button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Product List</h1>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search Products..."
                        className="pl-10 w-full md:w-[300px]"
                    />
                </div>
            </div>
            <Card className="overflow-x-auto">
                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[20%]">Name</TableHead>
                                <TableHead className="w-[20%]">Type</TableHead>
                                <TableHead className="w-[20%]">Model</TableHead>
                                <TableHead className="w-[20%]">Status</TableHead>
                                <TableHead className="w-[20%]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length > 0 ? (
                                products.map((product: ProductType) => (
                                    <TableRow key={product.uuid}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.type}</TableCell>
                                        <TableCell>{product.model_number}</TableCell>
                                        <TableCell>
                                            {product.status === "Active" && (
                                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                                            )}
                                            {product.status === "Inactive" && (
                                                <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            {product.status === "Active" && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-yellow-500 hover:bg-yellow-600"
                                                    onClick={() => handleInactive(product.uuid)}
                                                    disabled={inactiveProductMutation.isPending}
                                                >
                                                    {inactiveProductMutation.isPending ? "Inactivating..." : "Inactive"}
                                                </Button>
                                            )}
                                            {product.status === "Inactive" && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600"
                                                    onClick={() => handleActive(product.uuid)}
                                                    disabled={activeProductMutation.isPending}
                                                >
                                                    {activeProductMutation.isPending ? "Activating..." : "Active"}
                                                </Button>
                                            )}

                                            <Button variant="default" size="sm" onClick={() => navigate(`/products/edit/${product.uuid}`)}>Edit</Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(product.uuid)}
                                                disabled={deleteProductMutation.isPending}
                                            >
                                                {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </>
    );
};

export default ProductList;
