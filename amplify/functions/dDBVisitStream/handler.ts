import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/dDBVisitStreamFcn";
import { Amplify } from "aws-amplify";
import { type NativeAttributeValue, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  earnPoints,
  getCustomer,
  handleRewards,
  handleTierLevels,
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
      const recordNewValues = unmarshall(
        record.dynamodb?.NewImage as Record<string, NativeAttributeValue>,
        { wrapNumbers: true }
      );
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(recordNewValues)}`);

      // Al registrar una visita:
      const newRecord = recordNewValues;
      if (newRecord) {
        // Consultar Customer para checar la fecha de inicio del tier(nivel)
        const retrievedCustomer = await getCustomer(
          newRecord.customerId as string
        );
        console.log("retrievedCustomer", retrievedCustomer);

        if (!retrievedCustomer) {
          logger.warn(
            `Customer with ID ${newRecord.customerId} not found. Skipping tier level handling.`
          );
          continue;
        }

        // Añadir puntos obtenidos en la visita
        if (newRecord?.pointsEarned?.value) {
          // Update tier points in PassKit
          logger.info(
            `Earning points for customer ${newRecord.customerId}: ${newRecord.pointsEarned.value}`
          );
          // Call the function to earn points
          // This function should handle the API call to PassKit
          try {
            await earnPoints({
              memberId: retrievedCustomer.passKitMemberId as string,
              points: +newRecord.pointsEarned.value as number,
            });
          } catch (error) {
            console.log(
              `Error earning points for customer ${newRecord.customerId}: ${error}`
            );
          }
        }

        // Consultar Rewards disponibles y asignar
        await handleRewards(newRecord.customerId as string);

        // Consultar y actualizar el nivel del Customer
        await handleTierLevels(
          newRecord.customerId as string,
          retrievedCustomer,
          env.DEFAULT_COMPANY || "botaneroazteca"
        );
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
