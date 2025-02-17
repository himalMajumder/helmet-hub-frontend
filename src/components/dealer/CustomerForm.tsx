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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
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


const CustomerForm = () => {
    const { toast } = useToast();
    const { authenticated_token } = useAppContext();
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

    const handleCustomerRegistration = async (values: FormValues, { setErrors, resetForm }: any) => {

        try {
            const response = await axiosConfig({
                method: "post",
                data: values,
                url: "customer/registration",
                headers: {
                    Authorization: `Bearer ${authenticated_token}`,
                }
            })

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Customer registered successfully",
                });
                resetForm();
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                let errors = error.response.data.errors;
                let formikErrors: Record<string, string> = {};
                for (let key in errors) {
                    formikErrors[key] = errors[key];
                }

                setErrors(formikErrors);

                toast({
                    title: "Error",
                    description: "Failed to register customer. Please try again.",
                    variant: "destructive",
                });
            } 
        }
    }



    return (
        <Card className="p-6 glass-card">
            <h2 className="text-2xl font-semibold mb-6">New Customer Registration</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleCustomerRegistration}
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
                            </div>

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
