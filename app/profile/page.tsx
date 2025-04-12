import { getCustomer } from "../actions/customer";
import ProfileForm from "./ProfileForm";
import { AuthGetCurrentUserServer } from "../utils/amplify-utils";

export default async function ProfilePage() {
  const user = await AuthGetCurrentUserServer();
  const customer = await getCustomer(user?.userId!);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ProfileForm customer={customer!} />
    </div>
  );
}
