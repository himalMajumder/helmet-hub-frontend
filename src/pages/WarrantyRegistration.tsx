import { Card } from "@/components/ui/card";
import CustomerForm from "@/components/dealer/CustomerForm";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const WarrantyRegistration = () => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6 mt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Warranty Registration</h1>
            <Card className="p-6">
              <CustomerForm />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WarrantyRegistration;