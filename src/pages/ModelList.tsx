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
import {BikeModel} from "@/lib/types";

// Fetch function for react-query
const fetchBikeModels = async (authenticated_token: string) => {
    try {
        const response = await axiosConfig({
            method: "get",
            url: "bike-model",
            headers: {
                Authorization: `Bearer ${authenticated_token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        return response.data.data.bikeModels;
    } catch (error) {
        console.error("Error fetching bike models:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch bike models");
    }

};

const ModelList = () => {
    const navigate = useNavigate();
    const { authenticated_token } = useAppContext();
    const { toast } = useToast();
    const queryClient = useQueryClient();


    /**
     * Query to fetch bike models
     */
    const { data: bikeModels = [], error, isError, refetch } = useQuery({
        queryKey: ["bikeModels"],
        queryFn: () => {
            return fetchBikeModels(authenticated_token);
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
     * Mutation to delete a bike model
     */
    const deleteBikeModelMutation = useMutation({
        mutationKey: ["deleteBikeModel"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "delete",
                url: `bike-model/${uuid}`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to delete bike model");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Bike model deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bikeModels"] });
        }
    });

    /**
     * Handle delete
     * @param uuid 
     */
    const handleDelete = async (uuid: string) => {
        if (window.confirm("Are you sure you want to delete this bike model?")) {
            deleteBikeModelMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };

    /**
     * Mutation to inactive a bike model
     */
    const inactiveBikeModelMutation = useMutation({
        mutationKey: ["suspendBikeModel"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "put",
                url: `bike-model/${uuid}/suspend`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to inactive bike model");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Bike model inactive successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bikeModels"] });
        }
    });

    /**
     * Handle inactive
     * @param uuid 
     */
    const handleInactive = async (uuid: string) => {
        if (window.confirm("Are you sure you want to inactive this bike model?")) {
            inactiveBikeModelMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };

    /**
     * Mutation to active a bike model
     */
    const activeBikeModelMutation = useMutation({
        mutationKey: ["activateBikeModel"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "put",
                url: `bike-model/${uuid}/activate`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to activate bike model");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Bike model activate successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["bikeModels"] });
        }
    });

     /**
     * Handle active
     * @param uuid 
     */
    const handleActive = async (uuid: string) => {
        if (window.confirm("Are you sure you want to inactive this bike model?")) {
            activeBikeModelMutation.mutateAsync(uuid).catch((error) => {
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
                <Button type="button" onClick={() => navigate("/models/create")} variant="default">Create Model</Button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Model List</h1>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search Bike Models..."
                        className="pl-10 w-full md:w-[300px]"
                    />
                </div>
            </div>
            <Card className="overflow-x-auto">
                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Name</TableHead>
                                <TableHead className="w-[20%]">Detail</TableHead>
                                <TableHead className="w-[20%]">Status</TableHead>
                                <TableHead className="w-[20%]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bikeModels.length > 0 ? (
                                bikeModels.map((bikeModel: BikeModel) => (
                                    <TableRow key={bikeModel.uuid}>
                                        <TableCell>{bikeModel.name}</TableCell>
                                        <TableCell>{bikeModel.detail}</TableCell>
                                        <TableCell>
                                            {bikeModel.status === "Active" && (
                                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                                            )}
                                            {bikeModel.status === "Inactive" && (
                                                <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            {bikeModel.status === "Active" && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-yellow-500 hover:bg-yellow-600"
                                                    onClick={() => handleInactive(bikeModel.uuid)}
                                                    disabled={inactiveBikeModelMutation.isPending}
                                                >
                                                    {inactiveBikeModelMutation.isPending ? "Inactivating..." : "Inactive"}
                                                </Button>
                                            )}
                                            {bikeModel.status === "Inactive" && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600"
                                                    onClick={() => handleActive(bikeModel.uuid)}
                                                    disabled={activeBikeModelMutation.isPending}
                                                >
                                                    {activeBikeModelMutation.isPending ? "Activating..." : "Active"}
                                                </Button>
                                            )}

                                            <Button variant="default" size="sm" onClick={() => navigate(`/models/edit/${bikeModel.uuid}`)}>Edit</Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(bikeModel.uuid)}
                                                disabled={deleteBikeModelMutation.isPending}
                                            >
                                                {deleteBikeModelMutation.isPending ? "Deleting..." : "Delete"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        No bike models found.
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

export default ModelList;
