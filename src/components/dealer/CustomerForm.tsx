import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncSelect from "react-select/async";
import { useState } from "react";
import { BikeModelType } from "@/lib/types";

interface FormValues {
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


const CustomerForm = () => {
    const { toast } = useToast();
    const { authenticated_token } = useAppContext();
    const queryClient = useQueryClient();
    const [selectedOption, setSelectedOption] = useState(null);

    // Fetch options from the server
    const loadOptions = async (inputValue) => {
        if (!inputValue) return [];

        try {
            const response = await axiosConfig({
                method: "get",
                url: "bike-model/search",
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                },
                params: {
                    search: inputValue,
                },
            });
            return response.data.data.map((item: BikeModelType) => ({
                value: item.uuid,
                label: item.name,
            }));
        } catch (error) {
            console.error("Error fetching options:", error);
            return [];
        }
    };

    const initialValues: FormValues = {
        name: "",
        phone: "",
        email: "",
        address: "",
        product: "",
        model: "",
        serial_number: "",
        memo_number: "",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Customer Name is required")
            .min(3, "Name must be at least 3 characters"),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "Phone must be only digits")
            .min(10, "Phone must be at least 10 digits")
            .required("Phone is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        address: Yup.string().required("Address is required"),
        product: Yup.string().required("Product selection is required"),
        model: Yup.string().required("Model selection is required"),
        serial_number: Yup.string().required("Serial Number is required"),
        memo_number: Yup.string().required("Memo Number is required"),
    });

    // Handle general errors
    const handleGeneralError = (error: any) => {
        toast({
            title: "Error",
            description: error.message || "Failed to create customer registration",
            variant: "destructive",
        });
    };

    // Handle successful submission
    const handleSuccess = () => {
        toast({
            title: "Success",
            description: "Customer Registration created successfully",
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
    const createCustomerRegistration = async (values: FormValues, token: string) => {
        if (!token) {
            throw new Error("Missing authentication token");
        }

        const response = await axiosConfig({
            method: "post",
            data: values,
            url: "customer/registration",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    };

    // Mutation setup
    const mutation = useMutation({
        mutationKey: ["createCustomerRegistration"],
        mutationFn: (values: FormValues) => createCustomerRegistration(values, authenticated_token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
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
            <h2 className="text-2xl font-semibold mb-6">New Customer Registration</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, resetForm }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Customer Name</Label>
                                <Field as={Input} id="name" name="name" className="w-full" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Field as={Input} id="phone" name="phone" type="tel" className="w-full" />
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Field as={Input} id="email" name="email" type="email" className="w-full" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Field as={Input} id="address" name="address" className="w-full" />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label>Product</Label>
                                <Select onValueChange={(value) => setFieldValue("product", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="helmet1">Sport Helmet X1</SelectItem>
                                        <SelectItem value="helmet2">City Rider Pro</SelectItem>
                                        <SelectItem value="helmet3">Adventure Elite</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ErrorMessage name="product" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    isClearable
                                    onChange={(selectedOption) => {
                                        setFieldValue("model", selectedOption.label);
                                        setSelectedOption(selectedOption);
                                    }}

                                    placeholder="Search..."
                                    value={selectedOption}
                                />
                                <ErrorMessage name="model" component="div" className="text-red-500 text-sm" />
                            </div>

                            {/* <div className="space-y-2">
                                <Label>Model</Label>
                                <Select onValueChange={(value) => setFieldValue("model", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="model1">2023 Edition</SelectItem>
                                        <SelectItem value="model2">Classic Series</SelectItem>
                                        <SelectItem value="model3">Premium Line</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ErrorMessage name="model" component="div" className="text-red-500 text-sm" />
                            </div> */}

                            <div className="space-y-2">
                                <Label htmlFor="serial_number">Serial Number</Label>
                                <Field as={Input} id="serial_number" name="serial_number" className="w-full" />
                                <ErrorMessage name="serial_number" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="memo_number">Memo Number</Label>
                                <Field as={Input} id="memo_number" name="memo_number" className="w-full" />
                                <ErrorMessage name="memo_number" component="div" className="text-red-500 text-sm" />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => resetForm()}>
                                Clear
                            </Button>
                            <Button type="submit">Register Customer</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default CustomerForm;
