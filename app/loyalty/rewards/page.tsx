import { getCompany } from "@/app/actions/company";
import { getCustomer } from "../../actions/customer";
import { listVisits } from "../../actions/visit";
import { AuthGetCurrentUserServer } from "../../utils/amplify-utils";
import PointsComp from "./PointsComp";
import RewardsComp from "./RewardsComp";

export default async function LoyaltyRewardsPage() {
  const user = await AuthGetCurrentUserServer();
  const company = await getCompany(process.env.NEXT_PUBLIC_DEFAULT_COMPANY);
  const customer = await getCustomer(user?.userId!);
  const { totalPoints } = await listVisits(
    user?.userId!,
    customer?.tierEndDate
  );

  const availableTiers = company.tierLevels
    ? [...company?.tierLevels].sort(
        (a, b) => a?.pointsRequired! - b?.pointsRequired!
      )
    : undefined;

  const currentTierIdx =
    availableTiers?.findIndex((x) => x?.id === customer?.memberTier) || 0;

  const hasNextTier = !!(
    availableTiers?.length && currentTierIdx < availableTiers?.length - 1
  );

  const nextTier = hasNextTier
    ? availableTiers[currentTierIdx + 1]
    : availableTiers?.[currentTierIdx!];
  const neededPoints = (nextTier?.pointsRequired || 0) - (totalPoints || 0);

  return (
    <div className="py-4 px-2">
      <div className="space-y-6">
        <PointsComp
          userPoints={totalPoints}
          memberTier={customer?.memberTier}
          hasNextTier={hasNextTier}
          nextTierPoints={neededPoints}
        />
        <RewardsComp customerId={customer?.id} userPoints={totalPoints} />
      </div>
    </div>
  );
}
