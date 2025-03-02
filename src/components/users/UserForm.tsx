import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { RoleType, UserType } from "@/lib/types";
import Select from "react-select";

interface FormValues {
    name: string;
    email: string;
    password: string;
    role: { label: string; value: number }[];
}

const fetchUser = async (uuid: string, token: string) => {
    const response = await axiosConfig.get(`/users/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

// Create or Update API function
const saveUser = async ({ uuid, values, token }: { uuid?: string; values: FormValues; token: string }) => {
    const method = uuid ? "put" : "post";
    const url = uuid ? `/users/${uuid}` : "/users";

    const response = await axiosConfig({
        method,
        url,
        data: {
            ...values,
            role: values.role.map((r) => r.value),
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

const UserForm = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { authenticated_token } = useAppContext();
    const queryClient = useQueryClient();

    // Fetch user data if editing
    const { data: user, isLoading } = useQuery<UserType>({
        queryKey: ["user", uuid],
        queryFn: () => fetchUser(uuid!, authenticated_token),
        enabled: !!authenticated_token && !!uuid,
    });
 

    // Fetch roles
    const { data: roles = [] } = useQuery<RoleType[]>({
        queryKey: ["roles"],
        queryFn: async () => {
            const response = await axiosConfig.get(`/roles`, {
                headers: { Authorization: `Bearer ${authenticated_token}` },
            });
            return response.data.data;
        },
        enabled: !!authenticated_token,
    });

    const roleOptions = roles.map((role) => ({
        label: role.name,
        value: role.id,
    }));

    const initialValues: FormValues = {
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        role: user?.roles ? roleOptions.filter((option) => user.roles.some((r) => r.id === option.value)) : [],
    };

    // Validation Schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(3, "Must be at least 3 characters"),
        email: Yup.string().required("Email is required").email(),
        password: user?.name ? Yup.string().nullable() : Yup.string().required("Password is required").min(6, "Must be at least 6 characters"),
    });

    // Mutation for Create / Update
    const mutation = useMutation({
        mutationKey: ["saveUser"],
        mutationFn: (values: FormValues) => saveUser({ uuid, values, token: authenticated_token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({
                title: "Success",
                description: uuid ? "User updated!" : "User created!",
            });
            navigate("/users");
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response.data.message || "Failed to save User",
                variant: "destructive",
            });
        },
    });

    // Form Submission Handler
    const handleSubmit = async (values: FormValues, { setErrors, resetForm }: FormikHelpers<FormValues>) => {
        try {
            await mutation.mutateAsync(values);
            resetForm();
        } catch (error: any) {
            if (error.response?.status === 422) {
                const apiErrors = error.response.data.errors;
                const formErrors: Record<string, string> = {};
                Object.entries(apiErrors).forEach(([key, value]) => {
                    formErrors[key] = Array.isArray(value) ? value[0] : (value as string);
                });
                setErrors(formErrors);
            }
        }
    };

    if (isLoading && uuid) return <p>Loading...</p>;

    return (
        <Card className="p-6 glass-card">
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Field as={Input} id="name" name="name" className="w-full" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Field as={Input} id="email" name="email" className="w-full" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Field as={Input} id="password" name="password" type="password" placeholder="Example:123456" className="w-full" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    id="role"
                                    options={roleOptions}
                                    isMulti // ✅ Allow multiple role selection
                                    value={values.role} // ✅ Corrected value binding
                                    onChange={(selectedOptions) => setFieldValue("role", selectedOptions)}
                                    className="w-full"
                                />
                                <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => resetForm()}>
                                Clear
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? (uuid ? "Updating..." : "Creating...") : uuid ? "Update" : "Create"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default UserForm;
