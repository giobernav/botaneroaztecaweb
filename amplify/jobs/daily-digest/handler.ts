import type { EventBridgeHandler } from "aws-lambda";

import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/daily-digest";
import {
  customerSelectionSet,
  CustomerSS,
  getCompany,
  getLastVisits,
  getPointsEarned,
  handleBirthdayReward,
  listRewards,
  setPoints,
  updateMemberTier,
} from "./helpers";
import dayjs from "dayjs";
import { mockSystem } from "../../../app/utils/system-data";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: EventBridgeHandler<
  "Scheduled Event",
  null,
  void
> = async (event, context) => {
  console.log("event", JSON.stringify(event, null, 2));

  let customerNextToken = null;

  const timer = setTimeout(() => {
    console.log("oh no i'm going to timeout in 5 seconds!");
    // save last token
  }, context.getRemainingTimeInMillis() - 5 * 1000);

  try {
    // type: RECURRENT, ONCE
    // category:
    // --- BIRTHDAY (here on daily-digest) ****
    // --- REVIEW (set manually)
    // --- PROFILE (on customer stream)
    // --- COUPON (on visit stream)
    // --- WELCOME (on post-confirmation)
    const rewards = await listRewards();

    const company = await getCompany(env.DEFAULT_COMPANY);
    const { tierLevels } = company || mockSystem;

    const sortedTierLevels = [...tierLevels!]
      .sort((a, b) => a?.pointsRequired! - b?.pointsRequired!)
      .reverse();

    if (rewards.length) {
      // traer los Customer activos
      do {
        const customersRest: { data: CustomerSS[]; nextToken?: string | null } =
          await client.models.Customer.list({
            nextToken: customerNextToken,
            selectionSet: customerSelectionSet,
          });
        customerNextToken = customersRest?.nextToken || null;

        if (customersRest.data.length) {
          for (const customer of customersRest.data) {
            // comprobar memberTier y tierEndDate,
            // verificar si necesita actualización y comprobar si sube, baja o se mantiene en el nivel actual
            if (
              dayjs().endOf("day").unix() > dayjs(customer.tierEndDate).unix()
            ) {
              // expired
              // Consultar ultimas Visits del Customer desde el tierEndDate
              const lastVisits = await getLastVisits(
                customer.id,
                customer.tierEndDate!
              );

              // Puntos acumulados desde el inicio del tier (en el periodo)
              const pointsEarned: number = getPointsEarned(lastVisits);

              for (const level of sortedTierLevels) {
                if (
                  level?.pointsRequired &&
                  pointsEarned >= level?.pointsRequired
                ) {
                  // Nuevo nivel
                  await updateMemberTier(customer.id, level.id);
                  if (customer.passKitMemberId) {
                    // Actualizar PassKit Member Tier
                    await setPoints({
                      memberId: customer.passKitMemberId,
                      points: 0, // reset points
                      resetTierPoints: true,
                      tierId: level.id,
                    });
                  }
                  break;
                }
              }
            }

            await handleBirthdayReward(customer, rewards);
          }
        }
      } while (customerNextToken);
    }
  } catch (e) {
    console.log("error", e);
  } finally {
    clearTimeout(timer);
  }
};
