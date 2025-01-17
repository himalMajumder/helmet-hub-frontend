import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface FormData {
  dealerName: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  nidPhoto: File | null;
  tradeLicense: File | null;
  companyDocuments: File | null;
}

const BecomeDealer = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    dealerName: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    nidPhoto: null,
    tradeLicense: null,
    companyDocuments: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Here you would typically send the data to your backend
    toast({
      title: "Application Submitted",
      description: "We'll review your application and get back to you soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="container mx-auto max-w-3xl">
            <Card className="p-6">
              <h1 className="text-2xl font-bold mb-6">Become a Dealer</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dealerName">Dealer's Name</Label>
                    <Input
                      id="dealerName"
                      name="dealerName"
                      value={formData.dealerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Required Documents</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nidPhoto">NID Photo</Label>
                    <Input
                      id="nidPhoto"
                      name="nidPhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tradeLicense">Trade License</Label>
                    <Input
                      id="tradeLicense"
                      name="tradeLicense"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyDocuments">Company Documents</Label>
                    <Input
                      id="companyDocuments"
                      name="companyDocuments"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Submit Application</Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BecomeDealer;