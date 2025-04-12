import { generateClient, SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../data/resource";
import dayjs from "dayjs";

const client = generateClient<Schema>();

export const customerSelectionSet = [
  "id",
  "phone",
  "birthdate",
  "name",
  "lastName",
  "email",
  "memberTier",
  "tierEndDate",
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

type VisitSS = SelectionSet<Schema["Visit"]["type"], typeof visitSelectionSet>;

type RewardSS = SelectionSet<
  Schema["Reward"]["type"],
  typeof rewardSelectionSet
>;

export type CustomerSS = SelectionSet<
  Schema["Customer"]["type"],
  typeof customerSelectionSet
>;

const now = dayjs();

export const getCompany = async (id: string = "botaneroazteca") => {
  const { data } = await client.models.Company.get({ id });

  return data;
};

export const getLastVisits = async (
  customerId: string,
  tierEndDate: string
) => {
  const { data } = await client.models.Visit.listVisitByCustomer(
    {
      customerId,
      datetime: {
        between: [
          dayjs(tierEndDate).subtract(1, "year").startOf("day").toISOString(),
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

export const listRewards = async () => {
  let rwdTkn: string | null = null;
  let rwds: RewardSS[] = [];

  do {
    const rewardsResp: { data: RewardSS[]; nextToken?: string | null } =
      await client.models.Reward.listRewardByCategory(
        {
          category: "BIRTHDAY",
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
