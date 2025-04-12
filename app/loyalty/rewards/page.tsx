"use client";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Badge } from "@heroui/badge";
import { Icon } from "@iconify/react";

const rewards = [
  {
    id: "reward-1",
    title: "Free Coffee",
    description: "Get a free coffee with your next purchase",
    pointsRequired: 200,
    expiryDate: "Dec 31, 2023",
    isAvailable: true,
    image: "https://picsum.photos/seed/coffee/300/200",
  },
  {
    id: "reward-2",
    title: "10% Discount",
    description: "10% off your next purchase",
    pointsRequired: 350,
    expiryDate: "Dec 31, 2023",
    isAvailable: true,
    image: "https://picsum.photos/seed/discount/300/200",
  },
  {
    id: "reward-3",
    title: "Free Shipping",
    description: "Free shipping on your next online order",
    pointsRequired: 500,
    expiryDate: "Dec 31, 2023",
    isAvailable: false,
    image: "https://picsum.photos/seed/shipping/300/200",
  },
  {
    id: "reward-4",
    title: "VIP Event Access",
    description: "Exclusive access to our next product launch event",
    pointsRequired: 1000,
    expiryDate: "Dec 31, 2023",
    isAvailable: false,
    image: "https://picsum.photos/seed/vip/300/200",
  },
];

export default function LoyaltyRewardsPage() {
  // Filter rewards into available and locked
  const availableRewards = rewards.filter((reward) => reward.isAvailable);
  const lockedRewards = rewards.filter((reward) => !reward.isAvailable);

  const userPoints = 450;

  return (
    <div className="py-4 px-2">
      <div className="space-y-6">
        <div className="bg-content1 py-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Your Points</h3>
            <span className="text-xl font-bold text-primary">{userPoints}</span>
          </div>
          <Progress
            value={userPoints}
            maxValue={1000}
            color="primary"
            className="mb-2"
            showValueLabel={true}
            label="Progress to next tier"
          />
          <p className="text-sm text-default-500">
            Earn {1000 - userPoints} more points to reach Gold status
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Available Rewards</h3>
          {availableRewards.length === 0 ? (
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
              {availableRewards.map((reward) => (
                <Card key={reward.id} className="overflow-hidden">
                  <CardBody className="p-0">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{reward.title}</h4>
                        <Badge color="success" variant="flat">
                          Available
                        </Badge>
                      </div>
                      <p className="text-sm text-default-500 mt-1">
                        {reward.description}
                      </p>
                      <p className="text-xs text-default-400 mt-2">
                        Expires: {reward.expiryDate}
                      </p>
                    </div>
                  </CardBody>
                  <CardFooter className="justify-between">
                    <div className="flex items-center">
                      <Icon icon="lucide:star" className="text-warning mr-1" />
                      <span className="text-sm">
                        {reward.pointsRequired} points
                      </span>
                    </div>
                    <Button size="sm" color="primary">
                      Redeem
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Locked Rewards</h3>
          {lockedRewards.length === 0 ? (
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
              {lockedRewards.map((reward) => (
                <Card key={reward.id} className="overflow-hidden opacity-70">
                  <CardBody className="p-0">
                    <div className="relative">
                      <img
                        src={reward.image}
                        alt={reward.title}
                        className="w-full h-40 object-cover filter grayscale"
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
                          Locked
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
                        {reward.pointsRequired} points
                      </span>
                    </div>
                    <Button size="sm" color="default" isDisabled>
                      Need {reward.pointsRequired - userPoints} more
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
