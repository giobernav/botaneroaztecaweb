import dayjs from "dayjs";
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/dDBCustomerStreamFcn";
import { Amplify } from "aws-amplify";
import { type NativeAttributeValue, unmarshall } from "@aws-sdk/util-dynamodb";
import { type Schema } from "../../data/resource";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-customer-stream-handler",
});

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    if (record.eventName === "INSERT") {
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    }

    if (record.eventName === "MODIFY") {
      const recordOldValues = unmarshall(
        record.dynamodb?.OldImage as Record<string, NativeAttributeValue>,
        { wrapNumbers: true }
      );
      const recordNewValues = unmarshall(
        record.dynamodb?.NewImage as Record<string, NativeAttributeValue>,
        { wrapNumbers: true }
      );

      // business logic to process new records
      logger.info(`Old Image: ${JSON.stringify(recordOldValues)}`);
      logger.info(`New Image: ${JSON.stringify(recordNewValues)}`);

      const customerId = recordNewValues?.id as string;
      if (customerId) {
        // Verificar si el usuario completó su perfil de usuario
        // name, lastName, birthday, email & phone
        const { data: retrievedCustomer } = await client.models.Customer.get(
          { id: customerId },
          {
            selectionSet: [
              "id",
              "name",
              "lastName",
              "email",
              "phone",
              "birthdate",
            ],
          }
        );

        const isProfileComplete = Boolean(
          retrievedCustomer?.name &&
            retrievedCustomer.lastName &&
            retrievedCustomer.email &&
            retrievedCustomer.phone &&
            retrievedCustomer.birthdate
        );
        console.log("isProfileComplete", isProfileComplete);

        // Verificar que no se haya entregado esa recompensa
        const { data: retrievedCusRew, errors } =
          await client.models.CustomerReward.listCusRewByCustomer(
            {
              customerId,
              typeCategory: {
                eq: {
                  type: "ONCE",
                  category: "PROFILE",
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

        console.log("retrievedCusRew", retrievedCusRew, errors);

        if (isProfileComplete && !retrievedCusRew.length) {
          // Find Reward
          const { data: retrievedRewards } =
            await client.models.Reward.listRewardByCategory({
              category: "PROFILE",
            });
          console.log("retrievedRewards", retrievedRewards);

          if (retrievedRewards.length) {
            // Crear CustomerReward de recompensa del perfil
            await client.models.CustomerReward.create({
              customerId,
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
              customerId,
              entryType: "TRIGGER",
            });
          }
        }
      }
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
