import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

interface FormValues {
    name: string;
    detail: string;
}

const ModelCreateForm = () => {
    const { toast } = useToast();
    const { authenticated_token } = useAppContext();
    const queryClient = useQueryClient();

    const initialValues: FormValues = {
        name: "",
        detail: "",
    };

    // Validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .min(3, "Name must be at least 3 characters"),
        detail: Yup.string().nullable(),
    });

    // Handle general errors
    const handleGeneralError = (error: any) => {
        toast({
            title: "Error",
            description: error.message || "Failed to create bike model",
            variant: "destructive",
        });
    };

    // Handle successful submission
    const handleSuccess = () => {
        toast({
            title: "Success",
            description: "Bike created successfully",
        });
    };

    // Handle API validation errors
    const handleValidationErrors = (
        error: any,
        setErrors: FormikHelpers<FormValues>['setErrors']
    ) => {
        if (error.response?.status === 422) {
            const apiErrors = error.response.data.errors;
            const formErrors: Record<string, string> = {};

            Object.entries(apiErrors).forEach(([key, value]) => {
                formErrors[key] = Array.isArray(value) ? value[0] : value as string;
            });

            setErrors(formErrors);

            toast({
                title: "Validation Error",
                description: "Please check the form for errors",
                variant: "destructive",
            });
        }
    };


    // API call function
    const createBikeModel = async (values: FormValues, token: string) => {
        if (!token) {
            throw new Error("Missing authentication token");
        }

        const response = await axiosConfig({
            method: "post",
            data: values,
            url: "bike-model",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    };

    // Mutation setup
    const mutation = useMutation({
        mutationKey: ["createBikeModel"],
        mutationFn: (values: FormValues) => createBikeModel(values, authenticated_token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bikeModels"] });
        }
    });


    // Form submission handler
    const handleSubmit = async (
        values: FormValues,
        { setErrors, resetForm }: FormikHelpers<FormValues>
    ) => {
        try {
            await mutation.mutateAsync(values);
            handleSuccess();
            resetForm();
        } catch (error: any) {
            if (error.response?.status === 422) {
                handleValidationErrors(error, setErrors);
            } else {
                handleGeneralError(error);
            }
        }
    };



    return (
        <Card className="p-6 glass-card">
            <Formik
                initialValues={initialValues}
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => resetForm()}
                            >
                                Clear
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default ModelCreateForm;