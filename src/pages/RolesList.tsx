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
import { useEffect, useState } from "react";
import { RoleType } from "@/lib/types";

// Fetch function for react-query
const fetchRoles = async (authenticated_token: string, search?: string) => {
    try {
        const params: Record<string, string> = {};

        if (search) {
            params.search = search; // Only include 'search' if not empty
        }

        const response = await axiosConfig({
            method: "get",
            url: "/roles/permissions",
            params,
            headers: {
                Authorization: `Bearer ${authenticated_token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        return response.data.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch roles");
    }

};

const RolesList = () => {
    const navigate = useNavigate();
    const { authenticated_token } = useAppContext();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    /**
     * Query to fetch roles
     */
    const { data: roles = [], error, isError, refetch } = useQuery({
        queryKey: debouncedSearch ? ["roles_list", debouncedSearch] : ["roles_list"],
        queryFn: () => {
            return fetchRoles(authenticated_token, debouncedSearch);
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
     * Mutation to delete a Role
     */
    const deleteRoleMutation = useMutation({
        mutationKey: ["deleteRole"],
        mutationFn: async (id: number) => {
            const response = await axiosConfig({
                method: "delete",
                url: `/roles/${id}`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to delete Role");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "Role deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        }
    });

    /**
     * Handle delete
     * @param id 
     */
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this Role?")) {
            deleteRoleMutation.mutateAsync(id).catch((error) => {
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
                <Button type="button" onClick={() => navigate("/roles/create")} variant="default">Create Role</Button>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Role List</h1>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search roles..."
                        className="pl-10 w-full md:w-[300px]"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <Card className="overflow-x-auto">
                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Name</TableHead>
                                <TableHead className="w-[40%]">Permission</TableHead>
                                <TableHead className="w-[20%]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles && roles.length > 0 ? (
                                roles.map((role: RoleType) => (
                                    <TableRow key={Math.random()}>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>
                                            {role.permissions && role.permissions.length > 0 && (
                                                <>
                                                    {role.permissions.map((permission, index) => (
                                                        <Badge key={permission.id} variant="default" className="bg-green-600 hover:bg-green-800 m-1">
                                                            {permission.name}
                                                        </Badge>
                                                    ))}
                                                </>
                                            )}
                                        </TableCell>

                                        <TableCell className="space-x-2">
                                            <Button variant="default" size="sm" onClick={() => navigate(`/roles/edit/${role.id}`)}>Edit</Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(role.id)}
                                                disabled={deleteRoleMutation.isPending}
                                            >
                                                {deleteRoleMutation.isPending ? "Deleting..." : "Delete"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        No roles found.
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

export default RolesList;
