import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

import LoyaltyPageComp from "../components/loyalty/LoyaltyPageComp";
import { AuthGetCurrentUserServer } from "../utils/amplify-utils";
import { getCustomer } from "../actions/customer";

export default async function LoyaltyPage() {
  const user = await AuthGetCurrentUserServer();
  const customer = await getCustomer(user?.userId!);

  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const { device, os } = UAParser(userAgent || "");

  // console.log(device.type); // N900
  // console.log(device.vendor); // N900
  // console.log(os.name); // N900

  return (
    <LoyaltyPageComp
      isMobile={device.is("mobile")}
      os={os.name}
      customerId={user?.userId!}
      passKitMemberId={customer?.passKitMemberId || ""}
    />
  );
}
