"use server";

import {
  AuthGetCurrentUserServer,
  cookiesClient,
} from "@/app/utils/amplify-utils";

import {
  RedeemActionState,
  redeemFormSchema,
} from "../management/redeem/schema";

export async function redeemReward(
  entryType: "QR" | "MANUAL",
  customerRewardId: string | undefined | null,
  formData: FormData
): Promise<RedeemActionState> {
  const form = Object.fromEntries(formData);
  console.log("form", form);

  const validationResult =
    entryType === "QR"
      ? redeemFormSchema
          .partial({ customerPhone: true, rewardId: true })
          .safeParse(form)
      : redeemFormSchema.safeParse(form);
  console.log("validationResult", validationResult);

  // Return early if the form data is invalid
  if (!validationResult.success) {
    const errors: any = validationResult.error.flatten().fieldErrors;
    let fieldErrors = {};
    Object.keys(errors).map((x: string) => {
      fieldErrors = { ...fieldErrors, [x]: errors[x][0] };
    });

    return {
      success: false,
      form: {
        customerPhone: form.customerPhone as string,
        rewardId: form.table as string,
      },
      fieldErrors,
    };
  }

  let cusRew;
  const loggedInUser = await AuthGetCurrentUserServer();
  // console.log("loggedInUser", loggedInUser);

  if (customerRewardId) {
    // Check if the customerRewardId is valid
    const { data: customerReward } =
      await cookiesClient.models.CustomerReward.get(
        {
          id: customerRewardId,
        },
        { authMode: "userPool" }
      );

    if (!customerReward) {
      return {
        success: false,
        errors: ["Reward not found or invalid."],
      };
    }

    cusRew = customerReward;
  } else {
    // If no customerRewardId is provided, we assume the form contains the necessary data
    const rawFormData = {
      customerPhone: validationResult.data.customerPhone,
      rewardId: validationResult.data.rewardId,
    } as RedeemActionState["form"];

    console.log("rawFormData", rawFormData);

    const cognitoUser = await cookiesClient.queries.getCognitoUser(
      {
        username: rawFormData?.customerPhone.replace(/\s+/g, ""),
      },
      { authMode: "userPool" }
    );
    const customerId = cognitoUser.data?.Username!;

    if (!customerId) {
      return {
        success: false,
        errors: ["Usuario no encontrado"],
      };
    }

    let nt = undefined;
    let cr = undefined;

    do {
      //   retrieve customer reward by customerId and rewardId
      const {
        data: customerReward,
        errors,
        nextToken,
      } = await cookiesClient.models.CustomerReward.listCusRewByCustomer(
        {
          customerId,
        },
        {
          authMode: "userPool",
          filter: {
            id: {
              contains: rawFormData?.rewardId,
            },
            // status: {
            //   eq: "ACTIVE",
            // },
            // expiryDate: {
            //   ge: new Date().toISOString(), // Ensure the reward is not expired
            // },
          },
        }
      );
      cr = customerReward?.[0];
      nt = nextToken;

      if (cr) {
        // If we found a customer reward, we can break the loop
        break;
      }
    } while (nt);

    if (!cr) {
      return {
        success: false,
        errors: ["Reward not found or invalid."],
      };
    }

    cusRew = cr;
  }

  if (!cusRew) {
    // If no customer reward is found, return an error
    console.log("No customer reward found for redemption.");

    return {
      success: false,
      errors: ["Reward not found or invalid."],
    };
  }

  if (cusRew.status === "REDEEMED") {
    // If the reward has already been redeemed, return an error
    console.log(`Reward ${cusRew.id} has already been redeemed.`);

    return {
      success: false,
      errors: ["This reward has already been redeemed."],
    };
  }

  if (cusRew.status !== "ACTIVE") {
    // If the reward is not active, return an error
    console.log(`Reward ${cusRew.id} is not active.`);

    return {
      success: false,
      errors: ["This reward is not active for redemption."],
    };
  }

  if (cusRew.expiryDate && new Date(cusRew.expiryDate) < new Date()) {
    // If the reward has expired, return an error
    console.log(`Reward ${customerRewardId} has expired.`);
  }

  // Update the customer reward status to REDEEMED
  await cookiesClient.models.CustomerReward.update(
    {
      id: cusRew.id,
      status: "REDEEMED",
      redeemedBy: loggedInUser?.userId,
    },
    { authMode: "userPool" }
  );
  console.log(`Reward ${cusRew.id} redeemed by user ${loggedInUser?.userId}.`);

  // Here you would implement the logic to redeem the reward
  // For example, updating the user's points, sending a confirmation, etc.
  console.log(`Reward ${cusRew.id} redeemed successfully.`);

  return { success: true };
}
