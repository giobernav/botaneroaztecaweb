"use client";

import { useEffect, useState } from "react";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Icon } from "@iconify/react";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import dayjs from "dayjs";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

const client = generateClient<Schema>();

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

type CustomerRewardSS = SelectionSet<
  Schema["CustomerReward"]["type"],
  typeof customerRewardSelectionSet
>;

const CustomerRewardsComp = ({ customerId }: { customerId?: string }) => {
  const [availableRewards, setAvailableRewards] =
    useState<CustomerRewardSS[]>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetch = async () => {
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

      setAvailableRewards(cusRewards);
    };

    if (customerId) {
      fetch();
    }
  }, [customerId]);

  return (
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
                      <Icon icon="lucide:star" className="text-warning mr-1" />
                      <span className="text-sm">
                        {reward.reward.pointsRequired} puntos
                      </span>
                    </>
                  ) : null}
                </div>
                {reward.category === "COUPON" ? (
                  <Button size="sm" color="primary" onPress={onOpen}>
                    Canjear
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} placement={"bottom"} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CustomerRewardsComp;
