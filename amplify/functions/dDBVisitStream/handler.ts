import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-confirmation";
import { Amplify } from "aws-amplify";
import dayjs from "dayjs";
import {
  createCustomerReward,
  formatNumber,
  getCompany,
  getCustomer,
  getLastVisits,
  getPointsEarned,
  groupBy,
  listAvailableRewards,
  listCustomerRewards,
  updateMemberTier,
} from "./helpers";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-customer-stream-handler",
});

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    if (record.eventName === "INSERT") {
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);

      // Al registrar una visita:
      const newRecord = record.dynamodb?.NewImage;
      if (newRecord) {
        // Consultar Customer para checar la fecha de inicio del tier(nivel)
        const retrievedCustomer = await getCustomer(
          newRecord.customerId as string
        );

        // Consultar ultimas Visits del Customer desde el tierEndDate
        const lastVisits = await getLastVisits(
          newRecord.customerId as string,
          retrievedCustomer?.tierEndDate as string
        );

        // Puntos acumulados desde el inicio del tier (en el periodo)
        const pointsEarned: number = getPointsEarned(lastVisits);

        // Verificar si el tierEndDate sigue vigente,
        let tierExpired =
          dayjs().unix() > dayjs(retrievedCustomer?.tierEndDate).unix();
        // El periodo es: endTierDate - 1 año a la fecha actual

        const company = await getCompany(
          process.env.NEXT_PUBLIC_DEFAULT_COMPANY
        );
        const { tierLevels } = company!;

        // Obtener los últimos CustomerReward recibibos en el periodo
        const customerRewards = await listCustomerRewards(
          newRecord.customerId as string,
          retrievedCustomer?.tierEndDate as string
        );

        const groupedCustomerRewards = groupBy(
          customerRewards,
          (rwd) => rwd.rewardId
        );

        // Consultar Rewards disponibles
        const availableRewards = await listAvailableRewards();
        const sortedAvailableRewards = [...availableRewards]
          .sort((a, b) => a.pointsRequired! - b.pointsRequired!)
          .reverse();

        for (const availableReward of sortedAvailableRewards) {
          const qty = +formatNumber(
            pointsEarned / (availableReward?.pointsRequired || 0) -
              (groupedCustomerRewards?.[availableReward.id].length || 0)
          );

          if (qty >= 1) {
            // crear la cantidad de rewards disponibles y parar
            for (let index = 0; index < qty; index++) {
              await createCustomerReward(
                newRecord.customerId as string,
                availableReward
              );
            }
            break;
          }
        }

        if (tierLevels?.length) {
          if (!tierExpired) {
            // Verificar memberTier, sube, se mantiene o baja
            const currentMemberTier = retrievedCustomer?.memberTier;
            const currentMemberTierIdx = tierLevels.findIndex(
              (x) => x?.id === currentMemberTier
            );

            // Comprobar si hay siguiente nivel y si puede subir
            if (currentMemberTierIdx < tierLevels.length - 1) {
              const nextMemberTier = tierLevels[currentMemberTierIdx + 1];

              if (
                nextMemberTier?.pointsRequired &&
                pointsEarned >= nextMemberTier?.pointsRequired
              ) {
                // update memberTier and set new tierEndDate
                await updateMemberTier(
                  newRecord.customerId as string,
                  nextMemberTier.id
                );
              }
            }
          } else {
            // si expiró
            // Comprobar los puntos obtenidos hasta la fecha de vencimiento y asignar nuevo nivel
            const sortedTierLevels = [...tierLevels]
              .sort((a, b) => a?.pointsRequired! - b?.pointsRequired!)
              .reverse();
            for (const level of sortedTierLevels) {
              if (
                level?.pointsRequired &&
                pointsEarned >= level?.pointsRequired
              ) {
                // Nuevo nivel
                await updateMemberTier(
                  newRecord.customerId as string,
                  level.id
                );
                break;
              }
            }
          }
        }
      }
    }

    if (record.eventName === "MODIFY") {
      // business logic to process new records
      logger.info(`Old Image: ${JSON.stringify(record.dynamodb?.OldImage)}`);
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    }

    if (record.eventName === "REMOVE") {
      // business logic to process new records
      logger.info(`Old Image: ${JSON.stringify(record.dynamodb?.OldImage)}`);
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};
