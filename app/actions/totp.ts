"use server";
import {
  AuthGetCurrentUserServer,
  cookiesClient,
} from "@/app/utils/amplify-utils";
import totp from "@/lib/totp";

async function getCustomer(userId: string) {
  const { data: customer, errors } = await cookiesClient.models.Customer.get(
    {
      id: userId!,
    },
    {
      authMode: "identityPool",
      selectionSet: ["id", "phone", "secret"],
    }
  );

  console.log("errors", errors);

  return customer;
}

export async function generateToken() {
  const user = await AuthGetCurrentUserServer();
  const customer = await getCustomer(user?.userId!);

  if (customer?.secret) {
    const token = totp.generate(customer?.secret);

    return token;
  }
}

export async function verifyToken(userId: string, token: string) {
  const customer = await getCustomer(userId);

  if (customer?.secret) {
    const isValid = totp.verify({ token, secret: customer?.secret });

    return isValid;
  }
}
