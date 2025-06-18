import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
// import { generateClient } from "aws-amplify/data";
// import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
// import { env } from "$amplify/env/dDBCustomerStreamFcn";
// import { Amplify } from "aws-amplify";
// import { type NativeAttributeValue, unmarshall } from "@aws-sdk/util-dynamodb";
// import { type Schema } from "../../data/resource";
// import {
//   customerSelectionSet,
//   handleCompleteProfileReward,
//   handleEnrollMember,
// } from "./helpers";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-customer-stream-handler",
});

// const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
//   env
// );

// Amplify.configure(resourceConfig, libraryOptions);

// const client = generateClient<Schema>();

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    // if (record.eventName === "INSERT") {
    //   // business logic to process new records
    //   logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    // }

    // if (record.eventName === "MODIFY") {
    //   const recordOldValues = unmarshall(
    //     record.dynamodb?.OldImage as Record<string, NativeAttributeValue>,
    //     { wrapNumbers: true }
    //   );
    //   const recordNewValues = unmarshall(
    //     record.dynamodb?.NewImage as Record<string, NativeAttributeValue>,
    //     { wrapNumbers: true }
    //   );

    //   // business logic to process new records
    //   logger.info(`Old Image: ${JSON.stringify(recordOldValues)}`);
    //   logger.info(`New Image: ${JSON.stringify(recordNewValues)}`);

    //   const customerId = recordNewValues?.id as string;
    //   if (customerId) {
    //     // Verificar si el usuario completó su perfil de usuario
    //     // name, lastName, birthday, email & phone
    //     const { data: retrievedCustomer } = await client.models.Customer.get(
    //       { id: customerId },
    //       {
    //         selectionSet: customerSelectionSet,
    //       }
    //     );
    //     console.log("retrievedCustomer", retrievedCustomer);

    //     // Comprobar que el perfil tiene email y phone pero no tiene passKitMemberId
    //     if (
    //       !retrievedCustomer?.passKitMemberId &&
    //       retrievedCustomer?.email &&
    //       retrievedCustomer?.phone
    //     ) {
    //       console.log("Enrolling member in PassKit");
    //       await handleEnrollMember(retrievedCustomer);
    //     }

    //     // Comprobar si el usuario completó su perfil de usuario
    //     if (retrievedCustomer) {
    //       await handleCompleteProfileReward(retrievedCustomer);
    //     }
    //   }
    // }

    // if (record.eventName === "REMOVE") {
    //   // business logic to process new records
    //   logger.info(`Old Image: ${JSON.stringify(record.dynamodb?.OldImage)}`);
    //   logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    // }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};
