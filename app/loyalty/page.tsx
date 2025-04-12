import LoyaltyPageComp from "../components/loyalty/LoyaltyPageComp";
import { AuthGetCurrentUserServer } from "../utils/amplify-utils";

export default async function LoyaltyPage() {
  const user = await AuthGetCurrentUserServer();

  return <LoyaltyPageComp customerId={user?.userId!} />;
}
