import { getCustomer } from "../actions/customer";
import LoyaltyLayoutComp from "../components/loyalty/LoyaltyLayoutComp";
import { AuthGetCurrentUserServer } from "../utils/amplify-utils";

export default async function LoyaltyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await AuthGetCurrentUserServer();
  const customer = await getCustomer(user?.userId!);

  return (
    <main className="text-foreground bg-background">
      <div className="min-h-screen p-4 md:p-8">
        <LoyaltyLayoutComp customer={customer}>{children}</LoyaltyLayoutComp>
      </div>
    </main>
  );
}
