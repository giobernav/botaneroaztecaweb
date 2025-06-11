import { getCompany } from "../actions/company";
import { getCustomer } from "../actions/customer";
// import { listTiers } from "../actions/passkit";
import { listVisits } from "../actions/visit";
import LoyaltyLayoutComp from "../components/loyalty/LoyaltyLayoutComp";
import { AuthGetCurrentUserServer } from "../utils/amplify-utils";

export default async function LoyaltyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await AuthGetCurrentUserServer();
  const customer = await getCustomer(user?.userId!);
  const { totalPoints } = await listVisits(
    user?.userId!,
    customer?.tierEndDate
  );

  const company = await getCompany(process.env.NEXT_PUBLIC_DEFAULT_COMPANY);

  // const tiers = await listTiers(
  //   process.env.NEXT_PUBLIC_PASSKIT_PROGRAM_ID || ""
  // );
  // console.log("Pass Kit Tiers:", tiers);

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
    <main className="text-foreground bg-background">
      <div className="min-h-screen p-4 md:p-8">
        <LoyaltyLayoutComp
          customer={customer}
          totalPoints={totalPoints || 0}
          hasNextTier={hasNextTier}
          neededPoints={neededPoints}
        >
          {children}
        </LoyaltyLayoutComp>
      </div>
    </main>
  );
}
