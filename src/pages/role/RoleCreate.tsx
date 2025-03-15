import RoleForm from "@/components/roles/RoleForm";
import { Card } from "@/components/ui/card";

const RoleCreate = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Role</h1>
      <Card className="p-6">
        <RoleForm />
      </Card>
    </div>
  );
};

export default RoleCreate;