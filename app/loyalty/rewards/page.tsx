"use client";

import RewardsComp from "./RewardsComp";
import { useLoyaltyData } from "../LoyaltyDataProvider";

export default function LoyaltyRewardsPage() {
  const { customer, totalPoints } = useLoyaltyData();

  return (
    <div className="py-4 px-2">
      <div className="space-y-6">
        <RewardsComp customerId={customer?.id} userPoints={totalPoints} />
      </div>
    </div>
  );
}
