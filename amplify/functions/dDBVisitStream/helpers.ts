import { generateClient, SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../data/resource";
import dayjs from "dayjs";

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
        between: [
          tierEndDate
            ? dayjs(tierEndDate)
                .subtract(1, "year")
                .startOf("day")
                .toISOString()
            : now.subtract(180, "days").startOf("day").toISOString(),
          now.endOf("day").toISOString(),
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

export function formatNumber(x: number) {
  // convert it to a string
  var s = "" + x;
  // if x is integer, the point is missing, so add it
  if (s.indexOf(".") == -1) {
    s += ".";
  }
  // make sure if we have at least 2 decimals
  s += "00";
  // get the first 2 decimals
  return s.substring(0, s.indexOf(".") + 3);
}
