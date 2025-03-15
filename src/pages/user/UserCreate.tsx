import { Card } from "@/components/ui/card";
import UserForm from "@/components/users/UserForm";

const UserCreate = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create User</h1>
      <Card className="p-6">
        <UserForm />
      </Card>
    </div>
  );
};

export default UserCreate;