// import { generateClient, SelectionSet } from "aws-amplify/data";
// import dayjs from "dayjs";
// // import { env } from "$amplify/env/daily-digest";
// import { type Schema } from "../../data/resource";
// import apiKeyAuth from "../../../lib/passkit/apiKeyAuth";

// const client = generateClient<Schema>();

// export const customerSelectionSet = [
//   "id",
//   "phone",
//   "birthdate",
//   "name",
//   "lastName",
//   "email",
//   "memberTier",
//   "tierEndDate",
//   "profilePicture",
//   "passKitMemberId",
// ] as const;

// const rewardSelectionSet = [
//   "id",
//   "pointsRequired",
//   "title",
//   "description",
//   "status",
//   "type",
//   "category",
//   "expiryDate",
//   "expirationDays",
// ] as const;

// const visitSelectionSet = [
//   "id",
//   "status",
//   "customerId",
//   "datetime",
//   "pointsEarned",
//   "billAmount",
//   "createdAt",
//   "updatedAt",
//   "entryType",
// ] as const;

// type VisitSS = SelectionSet<Schema["Visit"]["type"], typeof visitSelectionSet>;

// type RewardSS = SelectionSet<
//   Schema["Reward"]["type"],
//   typeof rewardSelectionSet
// >;

// export type CustomerSS = SelectionSet<
//   Schema["Customer"]["type"],
//   typeof customerSelectionSet
// >;

// const now = dayjs();

// export const getCompany = async (id: string = "botaneroazteca") => {
//   const { data } = await client.models.Company.get({ id });

//   return data;
// };

// export const getLastVisits = async (
//   customerId: string,
//   tierEndDate: string
// ) => {
//   const { data } = await client.models.Visit.listVisitByCustomer(
//     {
//       customerId,
//       datetime: {
//         between: [
//           dayjs(tierEndDate).subtract(366, "days").startOf("day").toISOString(),
//           now.endOf("day").toISOString(),
//         ],
//       },
//     },
//     {
//       sortDirection: "DESC",
//       selectionSet: visitSelectionSet,
//     }
//   );

//   return data;
// };

// export const getPointsEarned = (lastVisits: VisitSS[]) => {
//   return lastVisits.reduce((sum, val) => sum + (val.pointsEarned || 0), 0);
// };

// export const listRewards = async () => {
//   let rwdTkn: string | null = null;
//   let rwds: RewardSS[] = [];

//   do {
//     const rewardsResp: { data: RewardSS[]; nextToken?: string | null } =
//       await client.models.Reward.listRewardByCategory(
//         {
//           category: "BIRTHDAY",
//         },
//         {
//           nextToken: rwdTkn,
//           filter: {
//             status: { eq: "ACTIVE" },
//             expiryDate: { ge: now.startOf("day").toISOString() },
//           },
//           selectionSet: rewardSelectionSet,
//         }
//       );
//     rwdTkn = rewardsResp?.nextToken || null;
//     rwds = [...rwds, ...rewardsResp.data];
//   } while (rwdTkn);

//   return rwds;
// };

// export const updateMemberTier = async (
//   customerId: string,
//   memberTier: string | undefined
// ) => {
//   return await client.models.Customer.update({
//     id: customerId,
//     memberTier,
//     tierEndDate: now.add(1, "year").endOf("day").toISOString(),
//   });
// };

// export const handleBirthdayReward = async (
//   customer: CustomerSS,
//   rewards: any[]
// ) => {
//   if (customer.birthdate == dayjs().format("YYYY-MM-DD")) {
//     // create customer reward & visit to earn points
//     await client.models.CustomerReward.create({
//       customerId: customer.id,
//       rewardId: rewards[0].id,
//       expiryDate: dayjs().add(1, "year").endOf("day").toISOString(),
//       status: "ACTIVE",
//       type: rewards[0].type,
//       category: rewards[0].category,
//     });
//     // Crear Visit con entryType = "TRIGGER" para asignar los puntos ganados por cumpleaños
//     await client.models.Visit.create({
//       datetime: dayjs().toISOString(),
//       billAmount: null,
//       pointsEarned: 2000,
//       table: null,
//       status: "ACTIVE",
//       customerId: customer.id,
//       entryType: "TRIGGER",
//     });
//   }
// };

// // change tier of a member in a program
// export async function changeMemberTier({
//   memberId,
//   tierId,
// }: {
//   memberId: string;
//   tierId: string;
// }) {
//   if (!env.PASSKIT_API_URL) {
//     throw new Error("PASSKIT_API_URL environment variable is not set");
//   }

//   if (!memberId || !tierId) {
//     throw new Error("Member ID and Tier ID are required");
//   }

//   if (typeof memberId !== "string" || typeof tierId !== "string") {
//     throw new Error("Member ID and Tier ID must be strings");
//   }

//   const url = env.PASSKIT_API_URL + `/members/member/tier`;

//   const token = apiKeyAuth(env.PASSKIT_REST_SECRET, env.PASSKIT_REST_KEY);

//   // Ensure the token is generated successfully
//   if (!token) {
//     throw new Error("Failed to generate API token");
//   }

//   try {
//     const response = await fetch(url, {
//       method: "PUT",
//       body: JSON.stringify({ memberId, tierId }),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const json = await response.json();
//     console.log(json);
//     return { success: true, data: json };
//   } catch (error) {
//     let message = "Unknown Error";
//     if (error instanceof Error) message = error.message;

//     return { success: false, message };
//   }
// }

// // set points for a member in a program
// export async function setPoints({
//   memberId,
//   points,
//   tierId = "", // optional tierId, can be empty
//   resetTierPoints = false, // optional, default is false
// }: {
//   memberId: string;
//   points: number;
//   tierId?: string; // optional tierId, can be empty
//   resetTierPoints?: boolean; // optional, default is false
// }) {
//   if (!env.PASSKIT_API_URL) {
//     throw new Error("PASSKIT_API_URL environment variable is not set");
//   }

//   if (!memberId || !points) {
//     throw new Error("Member ID and Points are required");
//   }

//   if (typeof memberId !== "string" || typeof points !== "number") {
//     throw new Error("Member ID must be a string and Points must be a number");
//   }

//   const url = env.PASSKIT_API_URL + `/members/member/points/set`;

//   const token = apiKeyAuth(env.PASSKIT_REST_SECRET, env.PASSKIT_REST_KEY);

//   // Ensure the token is generated successfully
//   if (!token) {
//     throw new Error("Failed to generate API token");
//   }

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       body: JSON.stringify({
//         id: memberId,
//         tierPoints: points,
//         tierId,
//         resetTierPoints,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const json = await response.json();
//     console.log(json);
//     return { success: true, data: json };
//   } catch (error) {
//     let message = "Unknown Error";
//     if (error instanceof Error) message = error.message;

//     return { success: false, message };
//   }
// }
