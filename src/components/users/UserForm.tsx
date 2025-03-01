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

interface FormValues {
    name: string;
    email: string;
    password: string;
}

const fetchBikeModel = async (uuid: string, token: string) => {
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
        data: values,
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
    const { authenticated_token} = useAppContext();
    const queryClient = useQueryClient();

    // Fetch bike model data if editing
    const { data: user, isLoading } = useQuery({
        queryKey: ["user", uuid],
        queryFn: () => fetchBikeModel(uuid!, authenticated_token),
        enabled: !!authenticated_token && !!uuid,
    });



    // Form Initial Values
    const initialValues: FormValues = {
        name: user?.name || "",
        email: user?.email || "",
        password: "",
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
                    formErrors[key] = Array.isArray(value) ? value[0] : value as string;
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
                enableReinitialize // Important to update form when data loads
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ resetForm }) => (
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
