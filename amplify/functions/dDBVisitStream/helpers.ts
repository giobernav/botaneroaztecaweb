import dayjs from "dayjs";
import { env } from "$amplify/env/dDBVisitStreamFcn";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../data/resource";
import { mockSystem } from "../../../app/utils/system-data";
import apiKeyAuth from "../../../lib/passkit/apiKeyAuth";

const client = generateClient<Schema>();

const now = dayjs();

const customerSelectionSet = [
  "name",
  "lastName",
  "birthdate",
  "status",
  "email",
  "phone",
  "memberTier", // 5, 10, 15%
  "tierEndDate", // from first visit or welcome
  "profilePicture",
  "passKitMemberId",
] as const;

const rewardSelectionSet = [
  "id",
  "pointsRequired",
  "title",
  "description",
  "status",
  "type",
  "category",
  "expiryDate",
  "expirationDays",
] as const;

const visitSelectionSet = [
  "id",
  "status",
  "customerId",
  "datetime",
  "pointsEarned",
  "billAmount",
  "createdAt",
  "updatedAt",
  "entryType",
] as const;

const customerRewardSelectionSet = [
  "id",
  "customerId",
  "rewardId",
  "expiryDate",
  "status",
  "type",
  "category", // BIRTHDAY, REVIEW, PROFILE, COUPON
  "createdAt",
  "reward.pointsRequired",
] as const;

type VisitSS = SelectionSet<Schema["Visit"]["type"], typeof visitSelectionSet>;
type RewardSS = SelectionSet<
  Schema["Reward"]["type"],
  typeof rewardSelectionSet
>;
export type CustomerSS = SelectionSet<
  Schema["Customer"]["type"],
  typeof customerSelectionSet
>;
type CustomerRewardSS = SelectionSet<
  Schema["CustomerReward"]["type"],
  typeof customerRewardSelectionSet
>;

export const getCompany = async (id: string = "botaneroazteca") => {
  const { data } = await client.models.Company.get({ id });

  return data;
};

export const getCustomer = async (customerId: string) => {
  const { data } = await client.models.Customer.get(
    {
      id: customerId,
    },
    {
      selectionSet: customerSelectionSet,
    }
  );

  return data;
};

export const getLastVisits = async (
  customerId: string,
  tierEndDate?: string | null
) => {
  const { data } = await client.models.Visit.listVisitByCustomer(
    {
      customerId,
      datetime: {
        between: tierEndDate
          ? [
              dayjs(tierEndDate)
                .subtract(366, "days")
                .startOf("day")
                .toISOString(),
              dayjs(tierEndDate).endOf("day").toISOString(),
            ]
          : [
              dayjs().subtract(180, "days").startOf("day").toISOString(),
              dayjs().endOf("day").toISOString(),
            ],
      },
    },
    {
      sortDirection: "DESC",
      selectionSet: visitSelectionSet,
    }
  );

  return data;
};

export const getPointsEarned = (lastVisits: VisitSS[]) => {
  return lastVisits.reduce((sum, val) => sum + (val.pointsEarned || 0), 0);
};

export const listAvailableRewards = async () => {
  let rwdTkn: string | null = null;
  let rwds: RewardSS[] = [];

  do {
    const rewardsResp: { data: RewardSS[]; nextToken?: string | null } =
      await client.models.Reward.listRewardByCategory(
        {
          category: "COUPON",
        },
        {
          nextToken: rwdTkn,
          filter: {
            status: { eq: "ACTIVE" },
            expiryDate: { ge: now.startOf("day").toISOString() },
          },
          selectionSet: rewardSelectionSet,
        }
      );
    rwdTkn = rewardsResp?.nextToken || null;
    rwds = [...rwds, ...rewardsResp.data];
  } while (rwdTkn);

  return rwds;
};

export const listCustomerRewards = async (customerId: string) => {
  let cusRwdTkn: string | null = null;
  let cusRwds: CustomerRewardSS[] = [];

  do {
    const customerRewardResp: {
      data: CustomerRewardSS[];
      nextToken?: string | null;
    } = await client.models.CustomerReward.listCusRewByCustomerByCreatedAt(
      {
        customerId,
        createdAt: {
          between: [
            now.subtract(180, "days").startOf("day").toISOString(),
            now.endOf("day").toISOString(),
          ],
        },
      },
      { selectionSet: customerRewardSelectionSet }
    );
    cusRwdTkn = customerRewardResp?.nextToken || null;
    cusRwds = [...cusRwds, ...customerRewardResp.data];
  } while (cusRwdTkn);

  return cusRwds;
};

export const createCustomerReward = async (
  customerId: string,
  reward: RewardSS
) => {
  return await client.models.CustomerReward.create(
    {
      status: "ACTIVE",
      rewardId: reward.id,
      customerId,
      expiryDate: now
        .add(reward?.expirationDays || 0, "days")
        .endOf("day")
        .toISOString(),
      type: reward.type,
      category: reward.category,
    },
    { selectionSet: customerRewardSelectionSet }
  );
};

export const updateMemberTier = async (
  customerId: string,
  memberTier: string | undefined
) => {
  return await client.models.Customer.update({
    id: customerId,
    memberTier,
    tierEndDate: now.add(1, "year").endOf("day").toISOString(),
  });
};

export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string
) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

export const handleRewards = async (customerId: string) => {
  // Consultar ultimas Visits del Customer en 180 días
  const lastVisits = await getLastVisits(customerId as string);
  console.log("lastVisits", lastVisits);

  // Puntos acumulados desde el inicio en el periodo
  const pointsEarned: number = getPointsEarned(lastVisits);

  // Obtener los últimos CustomerReward recibibos en el periodo
  const customerRewards = await listCustomerRewards(customerId as string);
  console.log("customerRewards", customerRewards);

  const groupedCustomerRewards = groupBy(
    customerRewards,
    (rwd) => rwd.rewardId
  );
  console.log("groupedCustomerRewards", groupedCustomerRewards);

  // Consultar Rewards disponibles
  const availableRewards = await listAvailableRewards();
  const sortedAvailableRewards = [...availableRewards]
    .sort((a, b) => a.pointsRequired! - b.pointsRequired!)
    .reverse();
  console.log("sortedAvailableRewards", sortedAvailableRewards);

  for (const availableReward of sortedAvailableRewards) {
    const qty = Math.floor(
      pointsEarned / (availableReward?.pointsRequired || 0) -
        (groupedCustomerRewards?.[availableReward.id]?.length || 0)
    );

    if (qty >= 1) {
      // crear la cantidad de rewards disponibles y parar
      for (let index = 0; index < qty; index++) {
        await createCustomerReward(customerId as string, availableReward);
      }
      break;
    }
  }
};

export const handleTierLevels = async (
  customerId: string,
  retrievedCustomer: CustomerSS | null,
  companyId: string = "botaneroazteca"
) => {
  // Últimas visitas del Customer para comprobar tierlevel
  // y puntos obtenidos en el periodo
  // Consultar ultimas Visits del Customer desde el tierEndDate
  const tierVisits = await getLastVisits(
    customerId as string,
    retrievedCustomer?.tierEndDate as string
  );
  console.log("tierVisits", tierVisits);

  // Puntos acumulados desde el inicio del tier (en el periodo)
  const pointsEarned: number = getPointsEarned(tierVisits);

  // Verificar si el tierEndDate sigue vigente
  let tierExpired =
    dayjs().unix() > dayjs(retrievedCustomer?.tierEndDate).unix();
  // El periodo es: endTierDate - 1 año a la fecha actual

  const company = await getCompany(companyId);
  const { tierLevels } = company || mockSystem;

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
          await updateMemberTier(customerId as string, nextMemberTier.id);
          // update passKit member tier
          console.log(
            `Updating member tier for customer ${customerId} to ${nextMemberTier.id}`
          );
          if (retrievedCustomer?.passKitMemberId) {
            try {
              await setPoints({
                memberId: retrievedCustomer?.passKitMemberId as string,
                points: 0,
                tierId: nextMemberTier.id,
                resetTierPoints: true,
              });
            } catch (error) {
              console.error(
                `Error updating PassKit member tier for customer ${customerId}: ${error}`
              );
            }
          }
        }
      }
    } else {
      // si expiró
      // Comprobar los puntos obtenidos hasta la fecha de vencimiento y asignar nuevo nivel
      const sortedTierLevels = [...tierLevels]
        .sort((a, b) => a?.pointsRequired! - b?.pointsRequired!)
        .reverse();
      for (const level of sortedTierLevels) {
        if (level?.pointsRequired && pointsEarned >= level?.pointsRequired) {
          // Nuevo nivel
          await updateMemberTier(customerId as string, level.id);
          if (retrievedCustomer?.passKitMemberId) {
            try {
              await setPoints({
                memberId: retrievedCustomer?.passKitMemberId as string,
                points: 0,
                tierId: level.id,
                resetTierPoints: true,
              });
            } catch (error) {
              console.error(
                `Error updating PassKit member tier for customer ${customerId}: ${error}`
              );
            }
          }
          break;
        }
      }
    }
  }
};

// earn points for a member in a program
export async function earnPoints({
  memberId,
  points,
  tierId = "", // optional tierId, can be empty
}: {
  memberId: string;
  points: number;
  tierId?: string; // optional tierId, can be empty
}) {
  if (!env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!memberId || !points) {
    throw new Error("Member ID and Points are required");
  }

  if (typeof memberId !== "string" || typeof points !== "number") {
    throw new Error("Member ID must be a string and Points must be a number");
  }

  const url = env.PASSKIT_API_URL + `/members/member/points/earn`;

  const token = apiKeyAuth(env.PASSKIT_REST_SECRET, env.PASSKIT_REST_KEY);

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({ id: memberId, tierPoints: points, tierId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    console.log("Earned Points Response:", response);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return { success: true, data: json };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;

    return { success: false, message };
  }
}

// set points for a member in a program
export async function setPoints({
  memberId,
  points,
  tierId = "", // optional tierId, can be empty
  resetTierPoints = false, // optional, default is false
}: {
  memberId: string;
  points: number;
  tierId?: string; // optional tierId, can be empty
  resetTierPoints?: boolean; // optional, default is false
}) {
  if (!env.PASSKIT_API_URL) {
    throw new Error("PASSKIT_API_URL environment variable is not set");
  }

  if (!memberId || points >= 0) {
    throw new Error("Member ID and Points are required");
  }

  if (typeof memberId !== "string" || typeof points !== "number") {
    throw new Error("Member ID must be a string and Points must be a number");
  }

  const url = env.PASSKIT_API_URL + `/members/member/points/set`;

  const token = apiKeyAuth(env.PASSKIT_REST_SECRET, env.PASSKIT_REST_KEY);

  // Ensure the token is generated successfully
  if (!token) {
    throw new Error("Failed to generate API token");
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        id: memberId,
        tierPoints: points,
        tierId,
        resetTierPoints,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return { success: true, data: json };
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;

    return { success: false, message };
  }
}
