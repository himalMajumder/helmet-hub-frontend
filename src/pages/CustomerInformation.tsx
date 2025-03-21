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
import { useEffect, useState } from "react";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Customer {
    uuid: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    product: string;
    model: string;
    serial_number: string;
    memo_number: string;
}

// Fetch function for react-query
const fetchCustomers = async (authenticated_token: string) => {
    try {
        const response = await axiosConfig({
            method: "get",
            url: "customer",
            headers: {
                Authorization: `Bearer ${authenticated_token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        return response.data.data.customers;
    } catch (error) {
        console.error("Error fetching bike models:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch bike models");
    }

};




const CustomerInformation = () => {
    const { authenticated_token } = useAppContext();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: customers = [], error, isError, refetch } = useQuery({
        queryKey: ["customers"],
        queryFn: () => {
            return fetchCustomers(authenticated_token);
        },
        enabled: !!authenticated_token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

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

    const deleteCustomerMutation = useMutation({
        mutationKey: ["deleteCustomer"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "delete",
                url: `customer/${uuid}`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to delete customer");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Bike model deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        }
    });

    const handleDelete = async (uuid: string) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            deleteCustomerMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };
    
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Customer Information</h1>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search customers..."
                        className="pl-10 w-full md:w-[300px]"
                    />
                </div>
            </div>
            <Card className="overflow-x-auto">
                <div className="p-6">
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
                            {
                                customers.map((customer: Customer) => (
                                    <TableRow key={customer.uuid}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.product}</TableCell>
                                        <TableCell>
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="secondary" size="sm">View Details</Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(customer.uuid)}
                                                disabled={deleteCustomerMutation.isPending}
                                            >
                                                {deleteCustomerMutation.isPending ? "Deleting..." : "Delete"}
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </>
    );
};

export default CustomerInformation;