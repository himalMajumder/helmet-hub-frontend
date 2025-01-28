import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, User } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axiosConfig from "@/lib/axiosConfig";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  console.log("API URL:", apiUrl);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");

  // Validation schemas
  const signInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const signUpSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
  });

  const handleLogin = async (values: { email: string; password: string }) => {

    toast({
      title: "Success",
      description: "Logged in successfully!",
    });

    let response = await axiosConfig({
      method: "get",
      url: "todos",
    })

    console.log(response);


    // localStorage.setItem("token", "mock-token"); // Simulate token storage
    // window.location.href = "/"; // Redirect to private route

    // // Mock authentication
    // if (
    //   values.email === "" || // Allow empty credentials
    //   (values.email === "admin@gmail.com" && values.password === "12345")
    // ) {
    //   toast({
    //     title: "Success",
    //     description: "Logged in successfully!",
    //   });
    //   navigate("/");
    // } else {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Invalid credentials. Try empty fields or admin@gmail.com/12345",
    //   });
    // }
  };

  const handleSignUp = (values: { fullName: string; email: string; password: string }) => {
    toast({
      title: "Success",
      description: "Account created successfully! Please sign in.",
    });
    setActiveTab("signin");
  };

  const handleForgotPassword = (values: { email: string }) => {
    toast({
      title: "Password Reset",
      description: "If your email exists, you'll receive reset instructions.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In </TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin" className="space-y-4">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={signInSchema}
              onSubmit={handleLogin}
            >
              {() => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        as={Input}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        as={Input}
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setActiveTab("forgot")}
                  >
                    Forgot Password?
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="signup" className="space-y-4">
            <Formik
              initialValues={{ fullName: "", email: "", password: "" }}
              validationSchema={signUpSchema}
              onSubmit={handleSignUp}
            >
              {() => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        name="fullName"
                        type="text"
                        placeholder="Full Name"
                        className="pl-10"
                        as={Input}
                      />
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        as={Input}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Field
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        as={Input}
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>

          {/* Forgot Password */}
          <TabsContent value="forgot" className="space-y-4">
            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleForgotPassword}
            >
              {() => (
                <Form className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      as={Input}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Reset Password
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setActiveTab("signin")}
                  >
                    Back to Sign In
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
