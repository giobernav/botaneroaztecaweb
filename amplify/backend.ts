import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
// import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { cognitoGetUserFcn } from "./functions/cognitoGetUser/resource";
// import { dDBCustomerStreamFcn } from "./functions/dDBCustomerStream/resource";
// import { dDBVisitStreamFcn } from "./functions/dDBVisitStream/resource";
// import { dailyDigestFcn } from "./jobs/daily-digest/resource";
import { postConfirmationFcn } from "./auth/post-confirmation/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  cognitoGetUserFcn,
  // dDBCustomerStreamFcn,
  // dDBVisitStreamFcn,
  // dailyDigestFcn,
  postConfirmationFcn,
  storage,
});

const { cfnResources } = backend.auth.resources;
const { cfnUserPool, cfnUserPoolClient } = cfnResources;

cfnUserPool.addPropertyOverride(
  "Policies.SignInPolicy.AllowedFirstAuthFactors",
  ["PASSWORD", "WEB_AUTHN", "EMAIL_OTP", "SMS_OTP"]
);

cfnUserPoolClient.explicitAuthFlows = [
  "ALLOW_REFRESH_TOKEN_AUTH",
  "ALLOW_USER_AUTH",
];

cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 6,
  },
};

cfnUserPool.smsAuthenticationMessage = "Tu codigo de autenticacion es {####}";
cfnUserPool.verificationMessageTemplate = {
  smsMessage: "Tu codigo de verificacion de tu nueva cuenta es: {####}",
};

const customerTable = backend.data.resources.tables["Customer"];
const policy = new Policy(
  Stack.of(customerTable),
  "MyDynamoDBFunctionStreamingPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: ["*"],
      }),
    ],
  }
);
// backend.dDBCustomerStreamFcn.resources.lambda.role?.attachInlinePolicy(policy);

// const mapping = new EventSourceMapping(
//   Stack.of(customerTable),
//   "MyDynamoDBFunctionTodoEventStreamMapping",
//   {
//     target: backend.dDBCustomerStreamFcn.resources.lambda,
//     eventSourceArn: customerTable.tableStreamArn,
//     startingPosition: StartingPosition.LATEST,
//   }
// );

// mapping.node.addDependency(policy);

// Visit stream
// const visitTable = backend.data.resources.tables["Visit"];
// const visitPolicy = new Policy(
//   Stack.of(visitTable),
//   "VisitDBFunctionStreamingPolicy",
//   {
//     statements: [
//       new PolicyStatement({
//         effect: Effect.ALLOW,
//         actions: [
//           "dynamodb:DescribeStream",
//           "dynamodb:GetRecords",
//           "dynamodb:GetShardIterator",
//           "dynamodb:ListStreams",
//         ],
//         resources: ["*"],
//       }),
//     ],
//   }
// );
// backend.dDBVisitStreamFcn.resources.lambda.role?.attachInlinePolicy(
//   visitPolicy
// );

// const visitMapping = new EventSourceMapping(
//   Stack.of(visitTable),
//   "DynamoDBFunctionVisitEventStreamMapping",
//   {
//     target: backend.dDBVisitStreamFcn.resources.lambda,
//     eventSourceArn: visitTable.tableStreamArn,
//     startingPosition: StartingPosition.LATEST,
//   }
// );

// visitMapping.node.addDependency(visitPolicy);
