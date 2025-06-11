"use client";

import React from "react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Icon } from "@iconify/react";
import parsePhoneNumber from "libphonenumber-js";
// import { formatNumber } from "@/app/utils/formatter";
import PointsComp from "@/app/loyalty/rewards/PointsComp";

interface ProfileHeaderProps {
  name: string;
  phone: string;
  avatarUrl: string;
  membershipLevel?: string;
  totalPoints: number;
  hasNextTier?: boolean;
  neededPoints?: number;
}

export function ProfileHeader({
  name,
  phone,
  avatarUrl,
  membershipLevel = "base",
  totalPoints,
  hasNextTier = false,
  neededPoints = 0,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 bg-content1 rounded-lg mb-6">
      <Avatar
        src={avatarUrl}
        className="w-20 h-20"
        isBordered
        color="default"
      />

      <div className="flex flex-col items-center md:items-start gap-1 flex-grow">
        <h2 className="text-xl font-bold">{name || "Bienvenid@ de nuevo"}</h2>
        <p className="text-default-500">
          {parsePhoneNumber(phone)?.formatInternational()}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="text-default-500">
            Nivel{" "}
            <span className="text-primary">{membershipLevel || "base"}</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Icon icon="lucide:star" className="text-warning" />
            <span className="text-sm">
              {formatNumber(totalPoints || 0, "decimal")} puntos
            </span>
          </div> */}
        </div>
      </div>

      <PointsComp
        userPoints={totalPoints}
        memberTier={membershipLevel}
        hasNextTier={hasNextTier}
        nextTierPoints={neededPoints}
      />

      <Button
        as={NextLink}
        href="/profile"
        variant="light"
        color="primary"
        endContent={<Icon icon="lucide:settings" />}
      >
        Ajustes
      </Button>
    </div>
  );
}
