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
    detail: string;
}

const fetchBikeModel = async (uuid: string, token: string) => {
    const response = await axiosConfig.get(`bike-model/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

// Create or Update API function
const saveBikeModel = async ({ uuid, values, token }: { uuid?: string; values: FormValues; token: string }) => {
    const method = uuid ? "put" : "post";
    const url = uuid ? `bike-model/${uuid}` : "bike-model";

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

const ModelForm = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { authenticated_token } = useAppContext();
    const queryClient = useQueryClient();

    // Fetch bike model data if editing
    const { data: bikeModel, isLoading } = useQuery({
        queryKey: ["bikeModel", uuid],
        queryFn: () => fetchBikeModel(uuid!, authenticated_token),
        enabled: !!authenticated_token && !!uuid,
    });

 

    // Form Initial Values
    const initialValues: FormValues = {
        name: bikeModel?.name || "",
        detail: bikeModel?.detail || "",
    };

    // Validation Schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(3, "Must be at least 3 characters"),
        detail: Yup.string().nullable(),
    });

    // Mutation for Create / Update
    const mutation = useMutation({
        mutationKey: ["saveBikeModel"],
        mutationFn: (values: FormValues) => saveBikeModel({ uuid, values, token: authenticated_token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bikeModels"] }); 
            toast({
                title: "Success",
                description: uuid ? "Bike model updated!" : "Bike model created!",
            });
            navigate("/models"); // Redirect after success
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to save bike model",
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
                                <Label htmlFor="detail">Detail</Label>
                                <Field as={Input} id="detail" name="detail" className="w-full" />
                                <ErrorMessage name="detail" component="div" className="text-red-500 text-sm" />
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

export default ModelForm;
