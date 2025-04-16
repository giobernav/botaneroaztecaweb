import { getCustomer } from "../actions/customer";
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
  const { visits: lastVisits } = await listVisits(
    user?.userId!,
    customer?.tierEndDate
  );

  return (
    <main className="text-foreground bg-background">
      <div className="min-h-screen p-4 md:p-8">
        <LoyaltyLayoutComp customer={customer} lastVisits={lastVisits!}>
          {children}
        </LoyaltyLayoutComp>
      </div>
    </main>
  );
}
