import { Card } from "@/components/ui/card";
import CustomerForm from "@/components/dealer/CustomerForm";

const WarrantyRegistration = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Warranty Registration</h1>
      <Card className="p-6">
        <CustomerForm />
      </Card>
    </div>
  );
};

export default WarrantyRegistration;