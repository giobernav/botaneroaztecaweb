import { getCustomer } from "../../actions/customer";
import { listVisits } from "../../actions/visit";
import { AuthGetCurrentUserServer } from "../../utils/amplify-utils";
import RewardsComp from "./RewardsComp";

export default async function LoyaltyRewardsPage() {
  const user = await AuthGetCurrentUserServer();
  const customer = await getCustomer(user?.userId!);
  const { totalPoints } = await listVisits(
    user?.userId!,
    customer?.tierEndDate
  );

  return (
    <div className="py-4 px-2">
      <div className="space-y-6">
        <RewardsComp customerId={customer?.id} userPoints={totalPoints} />
      </div>
    </div>
  );
}
