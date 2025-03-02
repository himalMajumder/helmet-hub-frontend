import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PermissionType } from "@/lib/types";

interface FormValues {
    name: string;
    permissions?: number[]
}

const fetchRole = async (id: number, token: string) => {
    const response = await axiosConfig.get(`/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

const saveRole = async ({ roleId, values, token, permissions }: { roleId?: number; values: FormValues; token: string, permissions: number[] }) => {
    const method = roleId ? "put" : "post";
    const url = roleId ? `/roles/${roleId}` : "/roles";
    values = { ...values, permissions };

    const response = await axiosConfig({
        method,
        url,
        data: values,
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

const RoleForm = () => {
    const { id } = useParams();
    const roleId = id ? Number(id) : undefined;

    const navigate = useNavigate();
    const { toast } = useToast();
    const { authenticated_token } = useAppContext();
    const queryClient = useQueryClient();
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [allChecked, setAllChecked] = useState(false);

    // Fetch Role Data
    const { data: role, isLoading } = useQuery({
        queryKey: ["roles", roleId],
        queryFn: () => fetchRole(roleId!, authenticated_token),
        enabled: !!authenticated_token && !!roleId,
    });

    // **Set Selected Permissions when Role Data is Fetched**
    useEffect(() => {
        if (role) {
            const existingPermissions = role.permissions.map((perm: PermissionType) => perm.id);
            setSelectedPermissions(existingPermissions);
        }
    }, [role]);



    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Role Name is required"),
    });

    const initialValues: FormValues = { name: role?.name || "" };

    // Fetch Permissions Data
    const { data: permissions = [] } = useQuery<PermissionType[]>({
        queryKey: ["permissions"],
        queryFn: async () => {
            const response = await axiosConfig.get(`/permissions`, {
                headers: { Authorization: `Bearer ${authenticated_token}` },
            });
            return response.data.data;
        },
        enabled: !!authenticated_token,
    });

    // **Group Permissions by Module**
    const groupedPermissions = permissions.reduce((groups: Record<string, PermissionType[]>, permission) => {
        const moduleName = permission.module || "Other";
        if (!groups[moduleName]) {
            groups[moduleName] = [];
        }
        groups[moduleName].push(permission);
        return groups;
    }, {});

    // **Select All (Global)**
    const handleCheckAll = () => {
        if (allChecked) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(permissions.map((perm) => perm.id));
        }
        setAllChecked(!allChecked);
    };

    // **Select All (Per Module)**
    const handleModuleCheckAll = (module: string, modulePermissions: PermissionType[]) => {
        const modulePermissionNames = modulePermissions.map((perm) => perm.id);
        const allSelected = modulePermissionNames.every((perm) => selectedPermissions.includes(perm));

        setSelectedPermissions((prev) =>
            allSelected
                ? prev.filter((perm) => !modulePermissionNames.includes(perm))
                : [...prev, ...modulePermissionNames.filter((perm) => !prev.includes(perm))]
        );
    };

    // **Toggle Individual Permission**
    const togglePermission = (permission: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
        );
    };

    // Update Global "Select All" when permissions change
    useEffect(() => {
        setAllChecked(selectedPermissions.length === permissions.length);
    }, [selectedPermissions, permissions]);

    const mutation = useMutation({
        mutationKey: ["saveRole"],
        mutationFn: (values: FormValues) => saveRole({ roleId, values, token: authenticated_token, permissions: selectedPermissions }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles_list"] });
            toast({ title: "Success", description: roleId ? "Role updated!" : "Role created!" });
            navigate("/roles");
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response.data.message || "Failed to save Role",
                variant: "destructive",
            });
        },
    });

    return (
        <Card className="p-6 glass-card">
            <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={mutation.mutate}>
                {({ resetForm }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Role Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Role Name</Label>
                                <Field as={Input} id="name" name="name" className="w-full" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>

                            {/* Permissions Section */}
                            <div className="space-y-4">
                                <Label>Permissions</Label>

                                {/* Global Select All */}
                                <div className="flex items-center space-x-2 border-b pb-2">
                                    <Checkbox checked={allChecked} onCheckedChange={handleCheckAll} />
                                    <Label className="font-bold">Select All Permissions</Label>
                                </div>

                                {/* Grouped Permissions */}
                                <div className="space-y-4">
                                    {Object.entries(groupedPermissions).map(([module, perms]) => {
                                        const allModuleSelected = perms.every((perm) => selectedPermissions.includes(perm.id));

                                        return (
                                            <div key={module} className="border p-4 rounded-md shadow-md">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Checkbox checked={allModuleSelected} onCheckedChange={() => handleModuleCheckAll(module, perms)} />
                                                    <h3 className="font-semibold">{module}</h3>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {perms.map((perm) => (
                                                        <div key={perm.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={selectedPermissions.includes(perm.id)}
                                                                onCheckedChange={() => togglePermission(perm.id)}
                                                            />
                                                            <Label>{perm.name}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => resetForm()}>
                                Clear
                            </Button>
                            <Button type="submit">
                                {roleId ? "Update" : "Create"} Role
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default RoleForm;
