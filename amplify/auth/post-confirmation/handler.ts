import type { PostConfirmationTriggerHandler } from "aws-lambda";

import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-confirmation";
import dayjs from "dayjs";
import { customAlphabet } from "nanoid";
import { mockSystem } from "../../../app/utils/system-data";
// import { enrollMember } from "./helpers";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  console.log("event.request", event.request);

  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstvwxyz", 20);

  try {
    const { data: company } = await client.models.Company.get({
      id: env.DEFAULT_COMPANY,
    });

    const { pointExpirationDays, tierLevels } = company || mockSystem;

    const sortedTierLevels = [...tierLevels!].sort(
      (a, b) => a?.pointsRequired! - b?.pointsRequired!
    );

    let passKitMemberId: string | undefined;

    // Enroll user in PassKit
    // if (env.PASSKIT_PROGRAM_ID) {
    //   const passKitMember = await enrollMember({
    //     programId: env.PASSKIT_PROGRAM_ID,
    //     tierId: sortedTierLevels[0]?.id || "base",
    //     externalId: event.userName,
    //     status: "ACTIVE",
    //     person: {
    //       externalId: event.userName,
    //       forename: event.request.userAttributes.given_name || "",
    //       surname: event.request.userAttributes.family_name || "",
    //       emailAddress: event.request.userAttributes.email || "",
    //       mobileNumber: event.request.userAttributes.phone_number || "",
    //     },
    //   });
    //   console.log("passKitMember", passKitMember);
    //   passKitMemberId = passKitMember.data?.id;
    // }

    // Create Customer
    const customerRes = await client.models.Customer.create(
      {
        id: event.userName,
        phone: event.request.userAttributes.phone_number,
        secret: nanoid(),
        owner: event.request.userAttributes.sub,
        memberTier: sortedTierLevels[0]?.id || "base",
        tierEndDate: dayjs()
          .add(pointExpirationDays || 365, "days")
          .endOf("day")
          .toISOString(),
        status: "ACTIVE",
        passKitMemberId,
      },
      { selectionSet: ["id", "memberTier", "phone", "status"] }
    );
    console.log("customerRes", customerRes.data, customerRes.errors);

    if (customerRes.errors) {
      throw new Error("User already exists");
    }

    const { data: retrievedCusRew } =
      await client.models.CustomerReward.listCusRewByCustomer(
        {
          customerId: event.userName,
          typeCategory: {
            eq: {
              type: "ONCE",
              category: "WELCOME",
            },
          },
        },
        {
          selectionSet: [
            "id",
            "customerId",
            "rewardId",
            "status",
            "expiryDate",
            "category",
            "type",
          ],
        }
      );

    if (!retrievedCusRew.length) {
      // Find Reward
      const { data: retrievedRewards } =
        await client.models.Reward.listRewardByCategory({
          category: "WELCOME",
        });
      console.log("retrievedRewards", retrievedRewards);

      if (retrievedRewards.length) {
        // Crear CustomerReward de recompensa del perfil
        await client.models.CustomerReward.create({
          customerId: event.userName,
          rewardId: retrievedRewards[0].id,
          expiryDate: dayjs().add(1, "year").endOf("day").toISOString(),
          status: "REDEEMED",
          type: retrievedRewards[0].type,
          category: retrievedRewards[0].category,
        });
        // Crear Visit con entryType = "TRIGGER" para asignar los puntos ganados por completar el perfil
        await client.models.Visit.create({
          datetime: dayjs().toISOString(),
          billAmount: null,
          pointsEarned: 1000,
          table: null,
          status: "ACTIVE",
          customerId: event.userName,
          entryType: "TRIGGER",
        });
      }
    }
  } catch (err) {
    console.log("Error procesing customer profile");
    console.log("err", err);
  }

  return event;
};
