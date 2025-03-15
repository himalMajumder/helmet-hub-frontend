import ModelForm from "@/components/model/ModelForm";
import { Card } from "@/components/ui/card";

const ModelCreate = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Bike Model</h1>
      <Card className="p-6">
        <ModelForm />
      </Card>
    </div>
  );
};

export default ModelCreate;