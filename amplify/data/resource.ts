import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a
  .schema({
    Customer: a.model({
      name: a.string(),
      lastName: a.string(),
      birth: a.date(),
      status: a.enum(["ACTIVE", "INACTIVE"]),
      cognitoId: a.id(),
      email: a.email(),
      phone: a.phone(),
      visits: a.hasMany("Visit", "customerId"),
      rewards: a.hasMany("CustomerReward", "customerId"),
    }),
    Reward: a.model({
      cost: a.integer(),
      title: a.string(),
      description: a.string(),
      status: a.enum(["ACTIVE", "INACTIVE"]),
      customers: a.hasMany("CustomerReward", "rewardId"),
    }),
    Visit: a.model({
      datetime: a.datetime(),
      billAmount: a.integer(),
      table: a.string(),
      status: a.enum(["ACTIVE", "INACTIVE"]),
      customerId: a.id().required(),
      customer: a.belongsTo("Customer", "customerId"),
    }),
    CustomerReward: a.model({
      customerId: a.id().required(),
      rewardId: a.id().required(),
      customer: a.belongsTo("Customer", "customerId"),
      reward: a.belongsTo("Reward", "rewardId"),
      validity: a.datetime(),
      status: a.enum(["ACTIVE", "INACTIVE", "EXPIRED", "REDEEMED"]),
    }),
  })
  .authorization((allow) => allow.publicApiKey());

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
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
