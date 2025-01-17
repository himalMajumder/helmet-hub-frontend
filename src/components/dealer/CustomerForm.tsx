import { useState } from "react";
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

const CustomerForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    product: "",
    model: "",
    serialNumber: "",
    memoNumber: "",
  });

  const sendSMS = async (phoneNumber: string, customerName: string) => {
    try {
      const apiKey = "52y$105KkJ4nc1owXyWNqZKGkH7SOPIYyltyy0lYs7GfBggCdXcLYO1DiB2K";
      const message = `Dear ${customerName}, thank you for registering with us. We will contact you shortly.`;
      const url = `http://portal.jadusms.com/smsapi/non-masking?api_key=${apiKey}&smsType=text&mobileNo=${phoneNumber}&smsContent=${encodeURIComponent(message)}`;
      
      const response = await fetch(url);
      console.log("SMS API Response:", response);
      
      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }
      
      toast({
        title: "SMS Sent",
        description: "Welcome message has been sent to the customer.",
      });
    } catch (error) {
      console.error("SMS sending failed:", error);
      toast({
        title: "SMS Failed",
        description: "Could not send welcome message to the customer.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Send SMS to the customer
    await sendSMS(formData.phone, formData.customerName);
    
    // Reset form
    setFormData({
      customerName: "",
      phone: "",
      email: "",
      address: "",
      product: "",
      model: "",
      serialNumber: "",
      memoNumber: "",
    });
    
    toast({
      title: "Success",
      description: "Customer registered successfully",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-2xl font-semibold mb-6">New Customer Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Product</Label>
            <Select onValueChange={(value) => handleSelectChange(value, "product")}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="helmet1">Sport Helmet X1</SelectItem>
                <SelectItem value="helmet2">City Rider Pro</SelectItem>
                <SelectItem value="helmet3">Adventure Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Model</Label>
            <Select onValueChange={(value) => handleSelectChange(value, "model")}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model1">2023 Edition</SelectItem>
                <SelectItem value="model2">Classic Series</SelectItem>
                <SelectItem value="model3">Premium Line</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="memoNumber">Memo Number</Label>
            <Input
              id="memoNumber"
              name="memoNumber"
              value={formData.memoNumber}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => setFormData({
              customerName: "",
              phone: "",
              email: "",
              address: "",
              product: "",
              model: "",
              serialNumber: "",
              memoNumber: "",
            })}
          >
            Clear
          </Button>
          <Button type="submit">Register Customer</Button>
        </div>
      </form>
    </Card>
  );
};

export default CustomerForm;