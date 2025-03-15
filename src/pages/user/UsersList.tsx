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
import { UserType } from "@/lib/types";

// Fetch function for react-query
const fetchUsers = async (authenticated_token: string, search?: string) => {
    try {
        const params: Record<string, string> = {};

        if (search) {
            params.search = search; // Only include 'search' if not empty
        }

        const response = await axiosConfig({
            method: "get",
            url: "/users",
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
        console.error("Error fetching users:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch users");
    }

};

const UsersList = () => {
    const navigate = useNavigate();
    const { authenticated_token, authenticatedUser, hasPermission } = useAppContext();
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
     * Query to fetch users
     */
    const { data: users = [], error, isError, refetch } = useQuery({
        queryKey: debouncedSearch ? ["users", debouncedSearch] : ["users"],
        queryFn: () => {
            return fetchUsers(authenticated_token, debouncedSearch);
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
     * Mutation to delete a user
     */
    const deleteUserMutation = useMutation({
        mutationKey: ["deleteRole"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "delete",
                url: `/users/${uuid}`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to delete user");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "user deleted successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });

    /**
     * Handle delete
     * @param uuid 
     */
    const handleDelete = async (uuid: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUserMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };

    /**
     * Mutation to inactive a user
     */
    const inactiveUserMutation = useMutation({
        mutationKey: ["suspendBikeModel"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "put",
                url: `/users/${uuid}/suspend`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to inactive user");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "user inactive successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });

    /**
     * Handle inactive
     * @param uuid 
     */
    const handleInactive = async (uuid: string) => {
        if (window.confirm("Are you sure you want to inactive this user?")) {
            inactiveUserMutation.mutateAsync(uuid).catch((error) => {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Something went wrong",
                });
            });
        }
    };

    /**
     * Mutation to active a user
     */
    const activeUserMutation = useMutation({
        mutationKey: ["activateBikeModel"],
        mutationFn: async (uuid: string) => {
            const response = await axiosConfig({
                method: "put",
                url: `/users/${uuid}/activate`,
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to activate user");
            }

            return response.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data.message || "user activate successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });

    /**
    * Handle active
    * @param uuid 
    */
    const handleActive = async (uuid: string) => {
        if (window.confirm("Are you sure you want to inactive this user?")) {
            activeUserMutation.mutateAsync(uuid).catch((error) => {
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
                {hasPermission('Create User') && <Button type="button" onClick={() => navigate("/users/create")} variant="default">Create User</Button>}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">User List</h1>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Search Users..."
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
                                <TableHead className="w-[30%]">Name</TableHead>
                                <TableHead className="w-[20%]">Email</TableHead>
                                <TableHead className="w-[20%]">Role</TableHead>
                                <TableHead className="w-[10%]">Status</TableHead>
                                <TableHead className="w-[20%]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users && users.length > 0 ? (
                                users.map((user: UserType) => (
                                    <TableRow key={user.uuid}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.roles && user.roles.length > 0 && (
                                                <>
                                                    {user.roles.map((role, index) => (
                                                        <Badge key={role.id} variant="default" className="bg-purple-700 hover:bg-purple-900 m-1">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {user.status === "Active" && (
                                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                                            )}
                                            {user.status === "Inactive" && (
                                                <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            {hasPermission('Deactivate User') && user.uuid !== authenticatedUser.uuid && user.status === "Active" && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-yellow-500 hover:bg-yellow-600"
                                                    onClick={() => handleInactive(user.uuid)}
                                                    disabled={inactiveUserMutation.isPending}
                                                >
                                                    {inactiveUserMutation.isPending ? "Inactivating..." : "Inactive"}
                                                </Button>
                                            )}
                                            {hasPermission('Activate User') && user.uuid !== authenticatedUser.uuid && user.status === "Inactive" && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600"
                                                    onClick={() => handleActive(user.uuid)}
                                                    disabled={activeUserMutation.isPending}
                                                >
                                                    {activeUserMutation.isPending ? "Activating..." : "Active"}
                                                </Button>
                                            )}

                                            {hasPermission('Edit User') && <Button variant="default" size="sm" onClick={() => navigate(`/users/edit/${user.uuid}`)}>Edit</Button>}

                                            { hasPermission('Delete User') && user.uuid !== authenticatedUser.uuid && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.uuid)}
                                                    disabled={deleteUserMutation.isPending}
                                                >
                                                    {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        No users found.
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

export default UsersList;
