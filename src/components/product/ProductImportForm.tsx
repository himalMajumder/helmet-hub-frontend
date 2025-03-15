import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface FormValues {
    file: File | null;
}


const importProduct = async ({ values, token }: { values: FormValues; token: string }) => {
    try {
        const formData = new FormData();
        if (values.file) {
            formData.append("file", values.file);
        }

        const response = await axiosConfig({
            method: "post",
            url: "/products/import",
            data: formData,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to upload file");
        } else {
            throw new Error("Network error, please try again");
        }
    }
};


const ProductImportForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { authenticated_token } = useAppContext();
    const queryClient = useQueryClient();

    const initialValues: FormValues = {
        file: null,
    };

    const validationSchema = Yup.object().shape({
        file: Yup.mixed().required("Excel file is required"),
    });

    // Mutation for Upload
    const mutation = useMutation({
        mutationKey: ["importProduct"],
        mutationFn: (values: FormValues) => importProduct({ values, token: authenticated_token }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bikeModels"] });
            toast({
                title: "Success",
                description: "Product uploaded successfully!",
            });
            navigate("/products");
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to upload product",
                variant: "destructive",
            });
        },
    });

    // Form Submission
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

    return (
        <Card className="p-6 glass-card">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, resetForm }) => (
                    <Form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="file">Upload File</Label>
                            <Input
                                type="file"
                                accept=".csv"
                                id="file"
                                className="w-full"
                                onChange={(event) => {
                                    if (event.currentTarget.files) {
                                        setFieldValue("file", event.currentTarget.files[0]);
                                    }
                                }}
                            />
                            <ErrorMessage name="file" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => resetForm()}>
                                Clear
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Uploading..." : "Upload"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default ProductImportForm;
