import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { cognitoGetUserFcn } from "../functions/cognitoGetUser/resource";
import { postConfirmationFcn } from "../auth/post-confirmation/resource";
import { dDBCustomerStreamFcn } from "../functions/dDBCustomerStream/resource";
import { dDBVisitStreamFcn } from "../functions/dDBVisitStream/resource";
import { dailyDigestFcn } from "../jobs/daily-digest/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a
  .schema({
    Customer: a
      .model({
        name: a.string(),
        lastName: a.string(),
        birthdate: a.date(),
        status: a.enum(["ACTIVE", "INACTIVE"]),
        email: a.email(),
        phone: a.phone(),
        secret: a.string(),
        visits: a.hasMany("Visit", "customerId"),
        rewards: a.hasMany("CustomerReward", "customerId"),
        memberTier: a.id().required(), // 5, 10, 15%
        tierEndDate: a.datetime(), // ISOString end of day, from first visit
        profilePicture: a.string(),
        owner: a.string(),
        passKitMemberId: a.string(),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.guest().to(["read"]),
        allow.authenticated("identityPool"),
      ]),
    Reward: a
      .model({
        pointsRequired: a.integer(),
        title: a.string(),
        description: a.string(),
        status: a.enum(["ACTIVE", "INACTIVE"]),
        type: a.enum(["RECURRENT", "ONCE"]),
        category: a.string().required(), // BIRTHDAY, REVIEW, PROFILE, COUPON, WELCOME, etc.
        expiryDate: a.datetime(),
        expirationDays: a.integer(),
        image: a.string(),
        customers: a.hasMany("CustomerReward", "rewardId"),
      })
      .secondaryIndexes((index) => [
        index("category").queryField("listRewardByCategory"),
      ])
      .authorization((allow) => [
        allow.guest(),
        allow.authenticated("identityPool"),
      ]),
    Visit: a
      .model({
        datetime: a.datetime().required(),
        billAmount: a.integer(),
        pointsEarned: a.integer(),
        table: a.string(),
        status: a.enum(["ACTIVE", "INACTIVE"]),
        customerId: a.id().required(),
        customer: a.belongsTo("Customer", "customerId"),
        entryType: a.enum(["QR", "MANUAL", "TRIGGER"]),
      })
      .secondaryIndexes((index) => [
        index("customerId")
          .sortKeys(["datetime"])
          .queryField("listVisitByCustomer"),
      ])
      .authorization((allow) => [
        allow.authenticated("identityPool").to(["read"]),
        allow
          .groups(["admin", "manager"])
          .to(["create", "update", "delete", "read"]),
      ]),
    CustomerReward: a
      .model({
        customerId: a.id().required(),
        rewardId: a.id().required(),
        customer: a.belongsTo("Customer", "customerId"),
        reward: a.belongsTo("Reward", "rewardId"),
        expiryDate: a.datetime(),
        status: a.enum(["ACTIVE", "INACTIVE", "EXPIRED", "REDEEMED"]),
        type: a.enum(["RECURRENT", "ONCE"]),
        category: a.string(), // BIRTHDAY, REVIEW, PROFILE, COUPON
        createdAt: a.datetime(),
      })
      .secondaryIndexes((index) => [
        index("customerId")
          .sortKeys(["type", "category"])
          .queryField("listCusRewByCustomer"),
        index("customerId")
          .sortKeys(["createdAt"])
          .queryField("listCusRewByCustomerByCreatedAt"),
      ])
      .authorization((allow) => [allow.authenticated("identityPool")]),
    CognitoGetUserResponse: a.customType({
      Username: a.string(),
      Enabled: a.boolean(),
      UserStatus: a.string(),
    }),
    getCognitoUser: a
      .query()
      .arguments({ username: a.phone() })
      .returns(a.ref("CognitoGetUserResponse"))
      .handler(a.handler.function(cognitoGetUserFcn))
      .authorization((allow) => [
        allow.guest(),
        allow.authenticated("identityPool"),
      ]),
    TierLevel: a.customType({
      id: a.id().required(),
      title: a.string(),
      description: a.string(),
      pointsRequired: a.integer(),
      discount: a.integer(),
      status: a.enum(["ACTIVE", "INACTIVE"]),
    }),
    Company: a
      .model({
        id: a.id(),
        name: a.string(),
        ddNextToken: a.string(),
        ddTimestamp: a.timestamp(),
        tierLevels: a.ref("TierLevel").array(),
        currency: a.string().default("EUR"),
        lang: a.string().default("ES"),
        logo: a.string(),
        pointExpirationDays: a.integer().default(365),
        passKitProgramId: a.string(),
      })
      .authorization((allow) => [
        allow.guest(),
        allow.authenticated("identityPool"),
      ]),
  })
  .authorization((allow) => [
    allow.resource(postConfirmationFcn),
    allow.resource(dDBCustomerStreamFcn),
    allow.resource(dDBVisitStreamFcn),
    allow.resource(dailyDigestFcn),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
