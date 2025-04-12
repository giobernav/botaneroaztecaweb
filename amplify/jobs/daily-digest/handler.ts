import type { EventBridgeHandler } from "aws-lambda";

import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-confirmation";
import {
  customerSelectionSet,
  CustomerSS,
  getCompany,
  getLastVisits,
  getPointsEarned,
  listRewards,
  updateMemberTier,
} from "./helpers";
import dayjs from "dayjs";

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

    const company = await getCompany("botaneroazteca");
    const { tierLevels } = company!;

    const sortedTierLevels = [...tierLevels]
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
        // customers = [...customers, ...customersRest.data];

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
                  break;
                }
              }
            }

            if (customer.birthdate == dayjs().format("YYYY-MM-DD")) {
              // create customer reward & visit to earn points
              await client.models.CustomerReward.create({
                customerId: customer.id,
                rewardId: rewards[0].id,
                expiryDate: dayjs().add(1, "year").endOf("day").toISOString(),
                status: "ACTIVE",
                type: rewards[0].type,
                category: rewards[0].category,
              });
              // Crear Visit con entryType = "TRIGGER" para asignar los puntos ganados por cumpleaños
              await client.models.Visit.create({
                datetime: dayjs().toISOString(),
                billAmount: null,
                pointsEarned: 2000,
                table: null,
                status: "ACTIVE",
                customerId: customer.id,
                entryType: "TRIGGER",
              });
            }
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
