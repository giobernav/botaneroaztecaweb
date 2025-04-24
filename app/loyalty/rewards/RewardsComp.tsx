"use client";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Icon } from "@iconify/react";

import { generateClient, SelectionSet } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const client = generateClient<Schema>();

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
  "image",
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
  "reward.title",
  "reward.description",
  "reward.image",
  "reward.pointsRequired",
] as const;

type RewardSS = SelectionSet<
  Schema["Reward"]["type"],
  typeof rewardSelectionSet
>;

type CustomerRewardSS = SelectionSet<
  Schema["CustomerReward"]["type"],
  typeof customerRewardSelectionSet
>;

const RewardsComp = ({
  customerId,
  userPoints,
}: {
  customerId?: string;
  userPoints?: number;
}) => {
  // Filter rewards into available and locked
  const [availableRewards, setAvailableRewards] =
    useState<CustomerRewardSS[]>();
  const [lockedRewards, setLockedRewards] = useState<RewardSS[]>();

  useEffect(() => {
    const fetch = async () => {
      const { data: aRewards } =
        await client.models.Reward.listRewardByCategory(
          {
            category: "COUPON",
          },
          {
            filter: {
              type: { eq: "RECURRENT" },
              status: { eq: "ACTIVE" },
              expiryDate: { ge: dayjs().startOf("day").toISOString() },
            },
            selectionSet: rewardSelectionSet,
          }
        );

      console.log("availableRewards res", aRewards);
      setLockedRewards(aRewards);

      const { data: cusRewards } =
        await client.models.CustomerReward.listCusRewByCustomer(
          {
            customerId: customerId!,
          },
          {
            filter: {
              status: { ne: "INACTIVE" },
              expiryDate: { ge: dayjs().startOf("day").toISOString() },
            },
            selectionSet: customerRewardSelectionSet,
          }
        );

      console.log("customerRewards", cusRewards);
      setAvailableRewards(cusRewards);
    };

    if (customerId) {
      fetch();
    }
  }, [customerId]);

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-3">Recompensas disponibles</h3>
        {availableRewards?.length === 0 ? (
          <Card>
            <CardBody className="flex flex-col items-center py-8 gap-2">
              <Icon
                icon="lucide:gift"
                className="text-default-400"
                width={48}
                height={48}
              />
              <p className="text-default-500">No available rewards</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards?.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <CardBody className="p-0">
                  <img
                    src={
                      reward.reward.image || reward.category === "WELCOME"
                        ? "/welcome_reward.png"
                        : reward.category === "PROFILLE"
                        ? "/profile_reward.png"
                        : "/reward.png"
                    }
                    alt={reward.reward.title || undefined}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{reward.reward.title}</h4>
                      <Badge color="success" variant="flat">
                        {reward.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-default-500 mt-1">
                      {reward.reward.description}
                    </p>
                    <p className="text-xs text-default-400 mt-2">
                      Expira: {dayjs(reward.expiryDate).format("DD-MMM-YYYY")}
                    </p>
                  </div>
                </CardBody>
                <CardFooter className="justify-between">
                  <div className="flex items-center">
                    {reward.reward.pointsRequired ? (
                      <>
                        <Icon
                          icon="lucide:star"
                          className="text-warning mr-1"
                        />
                        <span className="text-sm">
                          {reward.reward.pointsRequired} puntos
                        </span>
                      </>
                    ) : null}
                  </div>
                  {reward.category === "COUPON" ? (
                    <Button size="sm" color="primary">
                      Canjear
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Recompensas bloqueadas</h3>
        {lockedRewards?.length === 0 ? (
          <Card>
            <CardBody className="flex flex-col items-center py-8 gap-2">
              <Icon
                icon="lucide:lock"
                className="text-default-400"
                width={48}
                height={48}
              />
              <p className="text-default-500">No locked rewards</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedRewards?.map((reward) => (
              <Card key={reward.id} className="overflow-hidden opacity-70">
                <CardBody className="p-0">
                  <div className="relative">
                    <img
                      src={
                        reward.image || reward.category === "WELCOME"
                          ? "/welcome_reward.png"
                          : reward.category === "PROFILLE"
                          ? "/profile_reward.png"
                          : "/reward.png"
                      }
                      alt={reward.title || undefined}
                      className="w-full h-44 object-cover filter grayscale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Icon
                        icon="lucide:lock"
                        className="text-white"
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{reward.title}</h4>
                      <Badge color="default" variant="flat">
                        Bloqueada
                      </Badge>
                    </div>
                    <p className="text-sm text-default-500 mt-1">
                      {reward.description}
                    </p>
                  </div>
                </CardBody>
                <CardFooter className="justify-between">
                  <div className="flex items-center">
                    <Icon icon="lucide:star" className="text-warning mr-1" />
                    <span className="text-sm">
                      {reward.pointsRequired || 0} puntos
                    </span>
                  </div>
                  <Button size="sm" color="default" isDisabled>
                    Necesitas{" "}
                    {(reward?.pointsRequired || 0) - (userPoints || 0)} más
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RewardsComp;
