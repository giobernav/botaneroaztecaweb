import type { Handler } from "aws-lambda";
// import {
//   CognitoIdentityProviderClient,
//   AdminGetUserCommand,
// } from "@aws-sdk/client-cognito-identity-provider";
// import { env } from "$amplify/env/cognitoGetUserFcn";

// const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  console.log("EVENT", event);
  // your function code goes here
  // const command = new AdminGetUserCommand({
  //   // AdminGetUserRequest
  //   Username: event.arguments.username,
  //   UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  // });
  // const response = await client.send(command);

  // return response;
};
