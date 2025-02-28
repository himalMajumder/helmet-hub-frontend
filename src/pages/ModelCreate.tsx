import { Card } from "@/components/ui/card";
import CustomerForm from "@/components/dealer/CustomerForm";
import ModelCreateForm from "@/components/model/ModelCreateForm";

const ModelCreate = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Model</h1>
      <Card className="p-6">
        <ModelCreateForm />
      </Card>
    </div>
  );
};

export default ModelCreate;