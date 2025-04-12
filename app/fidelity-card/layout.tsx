import TopNavbar from "../components/TopNavbar";
import CustomerHeader from "../components/CustomerHeader";
import {
  AuthGetCurrentUserServer,
  cookiesClient,
} from "../utils/amplify-utils";

const FidelityCardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await AuthGetCurrentUserServer();
  console.log("current user", user);
  const { data: customer } = await cookiesClient.models.Customer.get({
    id: user?.username!,
  });
  console.log("customer", customer);

  return (
    <div className="w-full">
      <TopNavbar />
      <main className="mt-6 flex w-full flex-col items-center">
        <div className="w-full max-w-[1024px] px-4 lg:px-8">
          <CustomerHeader customerId={user?.username!} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default FidelityCardLayout;
